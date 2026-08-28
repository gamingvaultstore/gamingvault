import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormMessage from "../../components/FormMessage";
import { useAuth } from "../../hooks/useAuth";
import { errorMessage } from "../../services/api";

const AdminLogin = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await login(form);
      if (user.role !== "ADMIN") {
        logout();
        setError("Admin access required");
        return;
      }
      navigate("/admin");
    } catch (err) {
      setError(errorMessage(err, "Admin login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page admin-login">
      <form className="form-card" onSubmit={submit}>
        <span className="eyebrow">Admin</span>
        <h1>Admin Login</h1>
        <FormMessage>{error}</FormMessage>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
            required
          />
        </label>
        <button className="button wide" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <Link to="/" className="subtle-link">
          Back to site
        </Link>
      </form>
    </section>
  );
};

export default AdminLogin;
