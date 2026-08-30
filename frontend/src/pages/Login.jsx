import React from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormMessage from "../components/FormMessage";
import LoadingButton from "../components/LoadingButton";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import { errorMessage } from "../services/api";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
      addToast("Logged in successfully", "success");
      const fallback = user.role === "ADMIN" ? "/admin" : "/dashboard";
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (err) {
      const msg = errorMessage(err, "Login failed");
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="form-card" onSubmit={submit}>
        <span className="eyebrow">Welcome back</span>
        <h1>Login</h1>
        <FormMessage>{error}</FormMessage>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            placeholder="your@email.com"
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
        <Link className="subtle-link" to="/forgot-credentials">
          Forgot login ID or password?
        </Link>
        <p>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
