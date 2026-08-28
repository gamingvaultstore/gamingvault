import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <section className="section page-section success-panel">
    <span className="eyebrow">Missing page</span>
    <h1>Page not found</h1>
    <Link className="button" to="/marketplace">
      Back to Marketplace
    </Link>
  </section>
);

export default NotFound;
