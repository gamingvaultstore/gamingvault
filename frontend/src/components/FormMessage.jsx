import React from "react";
const FormMessage = ({ type = "error", children }) => {
  if (!children) return null;

  return <div className={`form-message ${type}`}>{children}</div>;
};

export default FormMessage;
