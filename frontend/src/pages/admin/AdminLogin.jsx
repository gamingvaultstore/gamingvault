import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormMessage from "../../components/FormMessage";
import LoadingButton from "../../components/LoadingButton";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import { errorMessage } from "../../services/api";

const AdminLogin = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
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
        const msg = "Admin access required";
        setError(msg);
        addToast(msg, "error");
        return;
      }
      addToast("Admin login successful", "success");
      navigate("/admin");
    } catch (err) {
      const msg = errorMessage(err, "Admin login failed");
      setError(msg);
      addToast(msg, "error");
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
            placeholder="admin@example.com"
            disabled={loading}
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
            placeholder="********"
            disabled={loading}
            required
          />
        </label>
        <LoadingButton
          className="button wide"
          loading={loading}
          loadingLabel="LOGGING IN..."
          type="submit"
        >
          LOGIN
        </LoadingButton>
        <Link to="/" className="subtle-link">
          Back to site
        </Link>
      </form>
    </section>
  );
};

export default AdminLogin;
