import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import FormMessage from "../components/FormMessage";
import api, { errorMessage } from "../services/api";

const ForgotCredentials = () => {
  const [emailForm, setEmailForm] = useState({ name: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [emailResult, setEmailResult] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const recoverEmail = async (event) => {
    event.preventDefault();
    setError("");
    setEmailResult("");
    try {
      const { data } = await api.post("/auth/forgot-email", emailForm);
      setEmailResult(`Your login ID is ${data.email}`);
    } catch (err) {
      setError(errorMessage(err, "Could not recover login ID"));
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (passwordForm.password !== passwordForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await api.post("/auth/reset-password", passwordForm);
      setMessage("Password reset successfully. You can now log in.");
      setPasswordForm({
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(errorMessage(err, "Could not reset password"));
    }
  };

  const update = (setter, form) => (field, value) =>
    setter({ ...form, [field]: value });

  return (
    <section className="auth-page">
      <div className="recovery-grid">
        <form className="form-card" onSubmit={recoverEmail}>
          <span className="eyebrow">Account recovery</span>
          <h1>Forgot login ID?</h1>
          <p>Use the name and phone number from your registration.</p>
          <FormMessage>{error}</FormMessage>
          <FormMessage type="success">{emailResult}</FormMessage>
          <label>
            Name
            <input
              value={emailForm.name}
              onChange={(event) =>
                update(setEmailForm, emailForm)("name", event.target.value)
              }
              required
            />
          </label>
          <label>
            Phone/WhatsApp
            <input
              value={emailForm.phone}
              onChange={(event) =>
                update(setEmailForm, emailForm)("phone", event.target.value)
              }
              required
            />
          </label>
          <button className="button wide">Recover Login ID</button>
        </form>

        <form className="form-card" onSubmit={resetPassword}>
          <span className="eyebrow">Password recovery</span>
          <h2>Reset password</h2>
          <p>Confirm your login email and registered phone number.</p>
          <FormMessage>{error}</FormMessage>
          <FormMessage type="success">{message}</FormMessage>
          <label>
            Login ID / Email
            <input
              type="email"
              value={passwordForm.email}
              onChange={(event) =>
                update(setPasswordForm, passwordForm)(
                  "email",
                  event.target.value,
                )
              }
              required
            />
          </label>
          <label>
            Phone/WhatsApp
            <input
              value={passwordForm.phone}
              onChange={(event) =>
                update(setPasswordForm, passwordForm)(
                  "phone",
                  event.target.value,
                )
              }
              required
            />
          </label>
          <label>
            New password
            <input
              type="password"
              minLength="8"
              value={passwordForm.password}
              onChange={(event) =>
                update(setPasswordForm, passwordForm)(
                  "password",
                  event.target.value,
                )
              }
              required
            />
          </label>
          <label>
            Confirm new password
            <input
              type="password"
              minLength="8"
              value={passwordForm.confirmPassword}
              onChange={(event) =>
                update(setPasswordForm, passwordForm)(
                  "confirmPassword",
                  event.target.value,
                )
              }
              required
            />
          </label>
          <button className="button wide">Reset Password</button>
        </form>
      </div>
      <Link to="/login" className="subtle-link">
        Back to login
      </Link>
    </section>
  );
};

export default ForgotCredentials;
