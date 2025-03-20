import React from 'react';
import CouponClaim from './CouponClaim';

function Home() {
  return (
    <div className="home-page">
      <header>
        <h1>Free Coupon Giveaway</h1>
        <p>Claim your free coupon below - one per user!</p>
      </header>
      <main>
        <CouponClaim />
      </main>
      <footer>
        <p>© {new Date().getFullYear()} Coupon Distribution System</p>
      </footer>
    </div>
  );
};

export default Home;