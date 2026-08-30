import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormMessage from "../components/FormMessage";
import LoadingButton from "../components/LoadingButton";
import { SkeletonAccountDetail } from "../components/SkeletonCard";
import { useToast } from "../context/ToastContext";
import api, { errorMessage, isCanceledRequest } from "../services/api";
import { formatCurrency, imageUrl } from "../utils/format";

const initialFieldErrors = {
  paymentId: "",
  screenshot: "",
};

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [order, setOrder] = useState(null);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [paymentId, setPaymentId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotName, setScreenshotName] = useState("");
  const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadPayment = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/orders/${orderId}`, {
          signal: controller.signal,
        });
        setOrder(data.order);
        setPaymentSettings(data.paymentSettings);
      } catch (err) {
        if (isCanceledRequest(err)) return;

        const msg = errorMessage(err, "Could not load payment page");
        setError(msg);
        addToast(msg, "error");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadPayment();

    return () => controller.abort();
  }, [orderId, retryCount, addToast]);

  const handleScreenshotChange = (event) => {
    const file = event.target.files?.[0];
    setFieldErrors((prev) => ({ ...prev, screenshot: "" }));

    if (!file) {
      setScreenshot(null);
      setScreenshotName("");
      return;
    }

    setScreenshot(file);
    setScreenshotName(file.name);
  };

  const validate = () => {
    const nextErrors = { ...initialFieldErrors };

    if (!paymentId.trim()) {
      nextErrors.paymentId = "Payment ID / UTR is required.";
    }

    if (!screenshot) {
      nextErrors.screenshot = "Payment screenshot is required.";
    }

    setFieldErrors(nextErrors);
    return !nextErrors.paymentId && !nextErrors.screenshot;
  };

  const submit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setError("");
    if (!validate()) {
      addToast("Please complete the required payment details", "warning");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("paymentId", paymentId.trim());
      formData.append("paymentScreenshot", screenshot);
      await api.patch(`/orders/${orderId}/payment`, formData);
      addToast("Payment submitted successfully", "success");
      navigate("/payment-success", { state: { orderId } });
    } catch (err) {
      const msg = errorMessage(err, "Payment submission failed");
      setError(msg);
      addToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="section page-section">
        <SkeletonAccountDetail />
      </section>
    );
  }

  if (!order) {
    return (
      <section className="section page-section">
        <div className="empty-state">
          <h3>{error || "Order not found"}</h3>
          <p>We could not load this payment page. Please retry.</p>
          <button
            className="button small"
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section page-section payment-grid">
      <div className="payment-summary">
        <span className="eyebrow">Complete Your Payment</span>
        <h1>{order.account?.title}</h1>
        <img
          src={imageUrl(order.account?.images?.[0])}
          alt={order.account?.title}
        />
        <div className="amount-box">
          <span>Amount</span>
          <strong>{formatCurrency(order.amount)}</strong>
        </div>
        <div className="payment-flow vertical">
          <span>Account selected</span>
          <span>Pay exact amount</span>
          <span>Enter UTR</span>
          <span>Upload screenshot</span>
          <span>Submit for review</span>
        </div>
      </div>

      <form className="form-card payment-card" onSubmit={submit}>
        <h2>UPI Payment</h2>
        <img
          className="qr-code"
          src={imageUrl(
            paymentSettings?.qrCodeUrl || "/placeholders/qr-placeholder.svg",
          )}
          alt="UPI QR code"
        />
        <p className="upi-id">{paymentSettings?.upiId || "example@upi"}</p>
        <FormMessage>{error}</FormMessage>
        <label>
          Payment ID / UTR <span className="required-mark">*</span>
          <input
            type="text"
            value={paymentId}
            onChange={(event) => {
              setPaymentId(event.target.value);
              setFieldErrors((prev) => ({ ...prev, paymentId: "" }));
            }}
            placeholder="Enter transaction ID or UTR"
            disabled={submitting}
            aria-invalid={fieldErrors.paymentId ? "true" : "false"}
          />
          {fieldErrors.paymentId && (
            <span className="form-error">{fieldErrors.paymentId}</span>
          )}
        </label>
        <label>
          Payment Screenshot <span className="required-mark">*</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleScreenshotChange}
            disabled={submitting}
            aria-invalid={fieldErrors.screenshot ? "true" : "false"}
          />
          {screenshotName && <span className="file-selected">{screenshotName}</span>}
          {fieldErrors.screenshot && (
            <span className="form-error">{fieldErrors.screenshot}</span>
          )}
        </label>
        <LoadingButton
          className="button wide"
          loading={submitting}
          loadingLabel="SUBMITTING..."
          type="submit"
        >
          SUBMIT PAYMENT
        </LoadingButton>
        <p className="helper-text">
          We verify payment manually and contact you on WhatsApp after review.
        </p>
      </form>
    </section>
  );
};

export default Payment;
