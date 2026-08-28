import React from "react";
const EmptyState = ({ title, text }) => (
  <div className="empty-state">
    <h3>{title}</h3>
    <p>{text}</p>
  </div>
);

export default EmptyState;
