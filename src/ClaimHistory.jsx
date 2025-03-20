import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ClaimHistory() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchClaimHistory();
  }, []);

  const fetchClaimHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://coupon-distribution-eta.vercel.app/api/coupons/claims', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setClaims(response.data.data);
      }
    } catch (err) {
      setError('Error fetching claim history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading claim history...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="claim-history-container">
      <h2>Coupon Claim History</h2>
      
      <table className="claim-table">
        <thead>
          <tr>
            <th>Coupon Code</th>
            <th>IP Address</th>
            <th>Session ID</th>
            <th>Claimed At</th>
          </tr>
        </thead>
        <tbody>
          {claims.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-data">No claim history available</td>
            </tr>
          ) : (
            claims.map(claim => (
              <tr key={claim._id}>
                <td>{claim.couponId?.code || 'N/A'}</td>
                <td>{claim.ipAddress}</td>
                <td>{claim.sessionId.substring(0, 8)}...</td>
                <td>{new Date(claim.claimedAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClaimHistory;