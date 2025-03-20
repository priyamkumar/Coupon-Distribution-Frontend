import React, { useState, useEffect } from "react";

function CouponForm({ coupon, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || "",
        description: coupon.description || "",
        isActive: coupon.isActive !== undefined ? coupon.isActive : true,
      });
    }
  }, [coupon]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="coupon-form-container">
      <h3>{coupon ? "Edit Coupon" : "Add New Coupon"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="code">Coupon Code:</label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            placeholder="Enter coupon code"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter coupon description"
            rows="3"
          />
        </div>
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label htmlFor="isActive">Active</label>
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">
            {coupon ? "Update Coupon" : "Add Coupon"}
          </button>
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
