import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CouponForm from './CouponForm';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/coupons', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setCoupons(response.data.data);
      }
    } catch (err) {
      setError('Error fetching coupons');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedCoupon(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (coupon) => {
    setSelectedCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedCoupon(null);
  };

  const handleFormSubmit = async (couponData) => {
    try {
      if (selectedCoupon) {
        // Update existing coupon
        await axios.put(`/api/coupons/${selectedCoupon._id}`, couponData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Add new coupon
        await axios.post('/api/coupons', couponData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      // Refresh the coupon list
      fetchCoupons();
      handleFormClose();
    } catch (err) {
      console.error('Error saving coupon:', err);
      setError('Error saving coupon');
    }
  };

  const toggleCouponStatus = async (coupon) => {
    try {
      await axios.put(`/api/coupons/${coupon._id}`, 
        { isActive: !coupon.isActive }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchCoupons();
    } catch (err) {
      console.error('Error toggling coupon status:', err);
      setError('Error updating coupon');
    }
  };

  const deleteCoupon = async (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await axios.delete(`/api/coupons/${couponId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchCoupons();
      } catch (err) {
        console.error('Error deleting coupon:', err);
        setError('Error deleting coupon');
      }
    }
  };

  if (loading) return <div>Loading coupons...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="coupon-list-container">
      <div className="header-actions">
        <h2>Coupon Management</h2>
        <button className="add-button" onClick={handleAddClick}>
          Add New Coupon
        </button>
      </div>

      {isFormOpen && (
        <CouponForm 
          coupon={selectedCoupon} 
          onSubmit={handleFormSubmit} 
          onCancel={handleFormClose} 
        />
      )}

      <table className="coupon-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
            <th>Status</th>
            <th>Used</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">No coupons available</td>
            </tr>
          ) : (
            coupons.map(coupon => (
              <tr key={coupon._id} className={!coupon.isActive ? 'inactive' : ''}>
                <td>{coupon.code}</td>
                <td>{coupon.description}</td>
                <td>
                  <span className={coupon.isActive ? 'active-badge' : 'inactive-badge'}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <span className={coupon.isUsed ? 'used-badge' : 'unused-badge'}>
                    {coupon.isUsed ? 'Used' : 'Available'}
                  </span>
                </td>
                <td>{new Date(coupon.createdAt).toLocaleDateString()}</td>
                <td className="actions">
                  <button 
                    className="edit-button" 
                    onClick={() => handleEditClick(coupon)}
                    disabled={coupon.isUsed}
                  >
                    Edit
                  </button>
                  <button 
                    className="toggle-button" 
                    onClick={() => toggleCouponStatus(coupon)}
                    disabled={coupon.isUsed}
                  >
                    {coupon.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    className="delete-button" 
                    onClick={() => deleteCoupon(coupon._id)}
                    disabled={coupon.isUsed}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CouponList;