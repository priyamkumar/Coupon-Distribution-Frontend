import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      
      <div className="admin-content">
        <nav className="admin-nav">
          <ul>
            <li>
              <Link to="/admin/dashboard">Overview</Link>
            </li>
            <li>
              <Link to="/admin/dashboard/coupons">Coupon Management</Link>
            </li>
            <li>
              <Link to="/admin/dashboard/claims">Claim History</Link>
            </li>
          </ul>
        </nav>
        
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;