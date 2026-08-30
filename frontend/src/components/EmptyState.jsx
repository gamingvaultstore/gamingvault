import React from "react";
const EmptyState = ({ title, text, children }) => (
  <div className="empty-state">
    <h3>{title}</h3>
    <p>{text}</p>
    {children}
  </div>
);

export default EmptyState;
