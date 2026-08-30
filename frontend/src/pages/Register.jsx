import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormMessage from "../components/FormMessage";
import LoadingButton from "../components/LoadingButton";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import { errorMessage } from "../services/api";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(form);
      addToast("Account created successfully", "success");
      navigate("/dashboard");
    } catch (err) {
      const msg = errorMessage(err, "Registration failed");
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

  return (
    <section className="auth-page">
      <form className="form-card" onSubmit={submit}>
        <span className="eyebrow">Create account</span>
        <h1>Register</h1>
        <FormMessage>{error}</FormMessage>
        <label>
          Name
          <input
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Your full name"
            disabled={loading}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="your@email.com"
            disabled={loading}
            required
          />
        </label>
        <label>
          Phone/WhatsApp
          <input
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            placeholder="+91 XXXXX XXXXX"
            disabled={loading}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            minLength="8"
            onChange={(event) => update("password", event.target.value)}
            placeholder="Minimum 8 characters"
            disabled={loading}
            required
          />
        </label>
        <LoadingButton
          className="button wide"
          loading={loading}
          loadingLabel="CREATING ACCOUNT..."
          type="submit"
        >
          REGISTER
        </LoadingButton>
        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
