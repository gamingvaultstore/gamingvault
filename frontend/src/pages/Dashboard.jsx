import React from "react";
import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import FormMessage from "../components/FormMessage";
import api, { errorMessage } from "../services/api";
import { formatCurrency, gameLabel, orderDate } from "../utils/format";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/auth/me");
        setData(response.data);
      } catch (err) {
        setError(errorMessage(err, "Could not load dashboard"));
      }
    };

    loadDashboard();
  }, []);

  if (error) {
    return (
      <section className="section page-section">
        <FormMessage>{error}</FormMessage>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="section page-section">Loading dashboard...</section>
    );
  }

  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="eyebrow">Your account</span>
        <h1>Dashboard</h1>
      </div>
      <div className="dashboard-grid">
        <div className="info-panel">
          <h2>{data.user.name}</h2>
          <p>{data.user.email}</p>
          <p>{data.user.phone}</p>
        </div>
        <div className="stat-panel">
          <span>Total purchases</span>
          <strong>{data.totalPurchases}</strong>
        </div>
      </div>

      <h2 className="subheading">Recent purchases</h2>
      {data.recentPurchases.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Account</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentPurchases.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    {order.account?.title}{" "}
                    <span>{gameLabel(order.account?.game)}</span>
                  </td>
                  <td>{formatCurrency(order.amount)}</td>
                  <td>{orderDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No purchases yet"
          text="Your recent purchases will appear here after you buy an account."
        />
      )}
    </section>
  );
};

export default Dashboard;
