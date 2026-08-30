import React from "react";

const LoadingButton = ({
  loading = false,
  loadingLabel = "Working...",
  children,
  className = "button",
  disabled = false,
  type = "button",
  ...props
}) => (
  <button
    className={className}
    disabled={disabled || loading}
    type={type}
    aria-busy={loading ? "true" : undefined}
    {...props}
  >
    {loading ? (
      <>
        <span className="button-spinner" aria-hidden="true">
          <span className="spinner-ring"></span>
        </span>
        {loadingLabel}
      </>
    ) : (
      children
    )}
  </button>
);

export default LoadingButton;
