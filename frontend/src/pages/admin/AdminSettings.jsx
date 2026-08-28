import React from "react";
import { useEffect, useState } from "react";
import FormMessage from "../../components/FormMessage";
import api, { errorMessage } from "../../services/api";
import { imageUrl } from "../../utils/format";

const AdminSettings = () => {
  const [upiId, setUpiId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await api.get("/admin/settings/payment");
        setUpiId(data.upiId);
        setQrCode(data.qrCodeUrl);
      } catch (err) {
        setError(errorMessage(err, "Could not load payment settings"));
      }
    };

    loadSettings();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("upiId", upiId);
      if (file) formData.append("qrCode", file);
      const { data } = await api.put("/admin/settings/payment", formData);
      setUpiId(data.upiId);
      setQrCode(data.qrCodeUrl);
      setFile(null);
      setMessage("Payment settings updated");
    } catch (err) {
      setError(errorMessage(err, "Could not update settings"));
    }
  };

  return (
    <div>
      <div className="section-heading">
        <span className="eyebrow">Payment</span>
        <h1>Settings</h1>
      </div>
      <form className="admin-form compact" onSubmit={submit}>
        <FormMessage type="success">{message}</FormMessage>
        <FormMessage>{error}</FormMessage>
        <label>
          UPI ID
          <input
            value={upiId}
            onChange={(event) => setUpiId(event.target.value)}
            required
          />
        </label>
        {qrCode && (
          <img
            className="qr-code"
            src={imageUrl(qrCode)}
            alt="Current QR code"
          />
        )}
        <label>
          QR Code
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setFile(event.target.files?.[0])}
          />
        </label>
        <button className="button">Save Settings</button>
      </form>
    </div>
  );
};

export default AdminSettings;
