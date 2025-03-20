import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Overview = () => {
  const [stats, setStats] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    claimedCoupons: 0,
    totalClaims: 0,
    recentClaims: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [couponsResponse, claimsResponse] = await Promise.all([
        axios.get('https://coupon-distribution-eta.vercel.app/api/coupons', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://coupon-distribution-eta.vercel.app/api/coupons/claims', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const coupons = couponsResponse.data.data;
      const claims = claimsResponse.data.data;

      setStats({
        totalCoupons: coupons.length,
        activeCoupons: coupons.filter(c => c.isActive && !c.isUsed).length,
        claimedCoupons: coupons.filter(c => c.isUsed).length,
        totalClaims: claims.length,
        recentClaims: claims.slice(0, 5)
      });
    } catch (err) {
      setError('Error fetching statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="overview-page">
      <h2>Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Coupons</h3>
          <div className="stat-value">{stats.totalCoupons}</div>
        </div>
        <div className="stat-card">
          <h3>Active Coupons</h3>
          <div className="stat-value">{stats.activeCoupons}</div>
        </div>
        <div className="stat-card">
          <h3>Claimed Coupons</h3>
          <div className="stat-value">{stats.claimedCoupons}</div>
        </div>
        <div className="stat-card">
          <h3>Total Claims</h3>
          <div className="stat-value">{stats.totalClaims}</div>
        </div>
      </div>
      
      <div className="recent-claims">
        <h3>Recent Claims</h3>
        {stats.recentClaims.length === 0 ? (
          <p>No recent claims</p>
        ) : (
          <ul className="recent-claims-list">
            {stats.recentClaims.map(claim => (
              <li key={claim._id}>
                <span className="claim-coupon">{claim.couponId?.code || 'N/A'}</span>
                <span className="claim-ip">{claim.ipAddress}</span>
                <span className="claim-time">{new Date(claim.claimedAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Overview;