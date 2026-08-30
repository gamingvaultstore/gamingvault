import React from "react";
import { useEffect, useState } from "react";
import FormMessage from "../../components/FormMessage";
import LoadingButton from "../../components/LoadingButton";
import { useToast } from "../../context/ToastContext";
import api, { errorMessage } from "../../services/api";
import {
  formatCurrency,
  gameLabel,
  imageUrl,
  orderDate,
} from "../../utils/format";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const { addToast } = useToast();

  const loadOrders = async () => {
    setLoading(orders.length === 0);
    try {
      const { data } = await api.get("/admin/orders");
      setOrders(data);
    } catch (err) {
      const msg = errorMessage(err, "Could not load orders");
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    const action = status.toLowerCase();
    setUpdating((prev) => ({ ...prev, [id]: action }));
    setError("");
    setMessage("");
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      const msg = `Order ${status.toLowerCase()}`;
      setMessage(msg);
      addToast(msg, "success");
      await loadOrders();
    } catch (err) {
      const msg = errorMessage(err, "Could not update order");
      setError(msg);
      addToast(msg, "error");
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: "" }));
    }
  };

  return (
    <div>
      <div className="section-heading">
        <span className="eyebrow">Payments</span>
        <h1>Orders</h1>
      </div>
      <FormMessage type="success">{message}</FormMessage>
      <FormMessage>{error}</FormMessage>
      <div className="admin-list">
        {loading ? (
          <div className="loading-line">Loading orders...</div>
        ) : orders.length === 0 && !error ? (
          <p
            style={{
              padding: "30px",
              color: "var(--muted)",
              textAlign: "center",
            }}
          >
            No orders yet
          </p>
        ) : error ? null : (
          orders.map((order) => (
            <article className="admin-row order-row" key={order._id}>
              <img
                src={imageUrl(order.account?.images?.[0])}
                alt={order.account?.title}
              />
              <div>
                <h3>{order.account?.title || "Deleted account"}</h3>
                <p>
                  {gameLabel(order.account?.game)} |{" "}
                  {formatCurrency(order.amount)} | {orderDate(order.createdAt)}
                </p>
                <p>
                  Customer: {order.user?.name} | {order.user?.phone} |{" "}
                  {order.user?.email}
                </p>
                <p>Payment ID / UTR: {order.paymentId || "Not submitted"}</p>
                <p
                  style={{
                    color:
                      order.status === "VERIFIED"
                        ? "var(--success)"
                        : order.status === "REJECTED"
                          ? "var(--danger)"
                          : "var(--muted)",
                  }}
                >
                  Status: <strong>{order.status}</strong>
                </p>
                {order.paymentScreenshot && (
                  <a
                    href={order.paymentScreenshot}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "var(--accent)" }}
                  >
                    Open payment screenshot →
                  </a>
                )}
              </div>
              <div className="row-actions">
                <LoadingButton
                  className="button small"
                  loading={updating[order._id] === "verified"}
                  loadingLabel="Verifying..."
                  onClick={() => updateStatus(order._id, "VERIFIED")}
                  disabled={order.status === "VERIFIED" || Boolean(updating[order._id])}
                >
                  Verify
                </LoadingButton>
                <LoadingButton
                  className="button small danger"
                  loading={updating[order._id] === "rejected"}
                  loadingLabel="Rejecting..."
                  onClick={() => updateStatus(order._id, "REJECTED")}
                  disabled={order.status === "REJECTED" || Boolean(updating[order._id])}
                >
                  Reject
                </LoadingButton>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
