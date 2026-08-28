import React from "react";
import { useEffect, useState } from "react";
import FormMessage from "../../components/FormMessage";
import api, { errorMessage } from "../../services/api";

const statLabels = {
  availableAccounts: "Available accounts",
  soldAccounts: "Sold accounts",
  pendingPayments: "Pending payments",
  totalOrders: "Total orders",
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await api.get("/admin/dashboard");
        setStats(data);
      } catch (err) {
        setError(errorMessage(err, "Could not load admin dashboard"));
      }
    };

    loadStats();
  }, []);

  return (
    <div>
      <div className="section-heading">
        <span className="eyebrow">Admin</span>
        <h1>Dashboard</h1>
      </div>
      <FormMessage>{error}</FormMessage>
      <div className="admin-stat-grid">
        {stats &&
          Object.entries(statLabels).map(([key, label]) => (
            <div className="stat-panel" key={key}>
              <span>{label}</span>
              <strong>{stats[key]}</strong>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
