import React from "react";
import { Link } from "react-router-dom";

const ReferEarn = () => (
  <section className="section page-section success-panel">
    <span className="eyebrow">Coming soon</span>
    <h1>Refer & Earn</h1>
    <p>
      Referral offers and rewards will be announced when available. For now,
      browse the marketplace and check back later.
    </p>
    <Link className="button" to="/marketplace">
      Browse Marketplace
    </Link>
  </section>
);

export default ReferEarn;
