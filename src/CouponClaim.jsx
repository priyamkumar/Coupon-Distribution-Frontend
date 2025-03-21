import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CouponClaim() {
  const [coupon, setCoupon] = useState(null);
  const [claimedCoupon, setClaimedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNextCoupon();
  }, []);

  const loadNextCoupon = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://coupon-distribution-eta.vercel.app/api/coupons/next', { withCredentials: true });
      if (response.data.success) {
        setCoupon(response.data.coupon);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading coupon');
    } finally {
      setLoading(false);
    }
  };

  const claimCoupon = async () => {
    if (!coupon) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'https://coupon-distribution-eta.vercel.app/api/coupons/claim',
        { couponId: coupon._id },
        { withCredentials: true }
      );

      if (response.data.success) {
        setClaimedCoupon(response.data.coupon);
        setCoupon(null);
        loadNextCoupon();
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError('You have already claimed a coupon recently. Please try again later.');
      } else {
        setError(err.response?.data?.message || 'Error claiming coupon');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coupon-claim-container">
      <h2>Claim Your Free Coupon</h2>

      {error && <div className="error-message">{error}</div>}

      {claimedCoupon ? (
        <div className="claimed-coupon">
          <h3>Successfully Claimed!</h3>
          <div className="coupon-code">{claimedCoupon.code}</div>
          <p>{claimedCoupon.description}</p>
        </div>
      ) : loading ? (
        <div className="loading">Loading...</div>
      ) : coupon ? (
        <div className="available-coupon">
          <h3>Available Coupon</h3>
          <button onClick={claimCoupon} disabled={loading} className="claim-button">
            Claim This Coupon
          </button>
        </div>
      ) : (
        <div className="no-coupons">
          <p>No coupons available at this time.</p>
        </div>
      )}
    </div>
  );
}

export default CouponClaim;