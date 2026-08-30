import React from "react";

const LoadingSpinner = ({ size = "md", text = "" }) => {
  const sizeClass = `spinner-${size}`;
  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner ${sizeClass}`}>
        <div className="spinner-ring"></div>
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
