import React from "react";
import { Link, useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const { state } = useLocation();

  return (
    <section className="section page-section success-panel">
      <div className="success-icon" aria-hidden="true">
        OK
      </div>
      <span className="eyebrow">Payment Submitted</span>
      <h1>Payment Details Received</h1>
      <p>
        Your UTR and screenshot have been submitted. The admin will verify the
        payment and contact you on WhatsApp with the account delivery details.
      </p>

      <div className="next-steps">
        <strong>What happens next?</strong>
        <span>Payment verification</span>
        <span>WhatsApp confirmation</span>
        <span>Account delivery</span>
      </div>

      {state?.orderId && (
        <p className="helper-text">Order ID: {state.orderId}</p>
      )}

      <div className="button-row center">
        <Link className="button" to="/dashboard">
          View Dashboard
        </Link>
        <Link className="button ghost" to="/marketplace">
          Back to Marketplace
        </Link>
      </div>
    </section>
  );
};

export default PaymentSuccess;
