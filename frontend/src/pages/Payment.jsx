import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormMessage from "../components/FormMessage";
import api, { errorMessage } from "../services/api";
import { formatCurrency, imageUrl } from "../utils/format";

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [paymentId, setPaymentId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadPayment = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data.order);
        setPaymentSettings(data.paymentSettings);
      } catch (err) {
        setError(errorMessage(err, "Could not load payment page"));
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [orderId]);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("paymentId", paymentId);
      formData.append("paymentScreenshot", screenshot);
      await api.patch(`/orders/${orderId}/payment`, formData);
      navigate("/payment-success");
    } catch (err) {
      setError(errorMessage(err, "Payment submission failed"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <section className="section page-section">Loading payment...</section>;
  }

  if (!order) {
    return (
      <section className="section page-section">
        <FormMessage>{error || "Order not found"}</FormMessage>
      </section>
    );
  }

  return (
    <section className="section page-section payment-grid">
      <div className="payment-summary">
        <span className="eyebrow">Complete Your Payment</span>
        <h1>{order.account?.title}</h1>
        <img src={imageUrl(order.account?.images?.[0])} alt={order.account?.title} />
        <div className="amount-box">
          <span>Amount</span>
          <strong>{formatCurrency(order.amount)}</strong>
        </div>
      </div>

      <form className="form-card payment-card" onSubmit={submit}>
        <h2>UPI Payment</h2>
        <img
          className="qr-code"
          src={imageUrl(paymentSettings?.qrCodeUrl || "/placeholders/qr-placeholder.svg")}
          alt="UPI QR code"
        />
        <p className="upi-id">{paymentSettings?.upiId || "example@upi"}</p>
        <FormMessage>{error}</FormMessage>
        <label>
          Payment ID / UTR
          <input
            value={paymentId}
            onChange={(event) => setPaymentId(event.target.value)}
            required
          />
        </label>
        <label>
          Payment Screenshot
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setScreenshot(event.target.files?.[0])}
            required
          />
        </label>
        <button className="button wide" disabled={submitting}>
          {submitting ? "Submitting..." : "SUBMIT PAYMENT"}
        </button>
      </form>
    </section>
  );
};

export default Payment;
