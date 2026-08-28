import React from "react";
import { useEffect, useState } from "react";
import FormMessage from "../../components/FormMessage";
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

  const loadOrders = async () => {
    try {
      const { data } = await api.get("/admin/orders");
      setOrders(data);
    } catch (err) {
      setError(errorMessage(err, "Could not load orders"));
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    setError("");
    setMessage("");
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      setMessage(`Order ${status.toLowerCase()}`);
      loadOrders();
    } catch (err) {
      setError(errorMessage(err, "Could not update order"));
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
        {orders.map((order) => (
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
              <p>Status: {order.status}</p>
              {order.paymentScreenshot && (
                <a
                  href={order.paymentScreenshot}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open payment screenshot
                </a>
              )}
            </div>
            <div className="row-actions">
              <button
                className="button small"
                onClick={() => updateStatus(order._id, "VERIFIED")}
                disabled={order.status === "VERIFIED"}
              >
                Verify
              </button>
              <button
                className="button small danger"
                onClick={() => updateStatus(order._id, "REJECTED")}
                disabled={order.status === "REJECTED"}
              >
                Reject
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
