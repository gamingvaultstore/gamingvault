import React from "react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => (
  <section className="section page-section success-panel">
    <span className="eyebrow">Payment submitted</span>
    <h1>Payment Details Submitted Successfully</h1>
    <p>
      Your payment details have been submitted. We will verify the payment and
      contact you on WhatsApp regarding your order.
    </p>
    <Link className="button" to="/marketplace">
      BACK TO MARKETPLACE
    </Link>
  </section>
);

export default PaymentSuccess;
