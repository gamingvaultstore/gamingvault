import React from "react";
import { useEffect, useState } from "react";
import FormMessage from "../../components/FormMessage";
import LoadingButton from "../../components/LoadingButton";
import { useToast } from "../../context/ToastContext";
import api, { errorMessage, isCanceledRequest } from "../../services/api";
import { imageUrl } from "../../utils/format";

const AdminSettings = () => {
  const [upiId, setUpiId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const controller = new AbortController();

    const loadSettings = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/admin/settings/payment", {
          signal: controller.signal,
        });
        setUpiId(data.upiId || "");
        setQrCode(data.qrCodeUrl || "");
      } catch (err) {
        if (isCanceledRequest(err)) return;

        const msg = errorMessage(err, "Could not load payment settings");
        setError(msg);
        addToast(msg, "error");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => controller.abort();
  }, [addToast]);

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0] || null;
    setFile(nextFile);
    setFileName(nextFile?.name || "");
    setMessage("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("upiId", upiId.trim());
      if (file) formData.append("qrCode", file);
      const { data } = await api.put("/admin/settings/payment", formData);
      setUpiId(data.upiId || "");
      setQrCode(data.qrCodeUrl || "");
      setFile(null);
      setFileName("");
      setMessage("Payment settings updated successfully");
      addToast("Payment settings updated successfully", "success");
    } catch (err) {
      const msg = errorMessage(err, "Could not update settings");
      setError(msg);
      addToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="section-heading">
        <span className="eyebrow">Payment</span>
        <h1>Settings</h1>
      </div>
      {loading ? (
        <div className="loading-line">Loading settings...</div>
      ) : (
        <form className="admin-form compact" onSubmit={submit}>
          <FormMessage type="success">{message}</FormMessage>
          <FormMessage>{error}</FormMessage>
          <label>
            UPI ID
            <input
              value={upiId}
              onChange={(event) => setUpiId(event.target.value)}
              placeholder="example@upi"
              disabled={saving}
              required
            />
          </label>
          {qrCode && (
            <div className="qr-preview">
              <span>Current QR Code</span>
              <img
                className="qr-code"
                src={imageUrl(qrCode)}
                alt="Current QR code"
              />
            </div>
          )}
          <label>
            New QR Code
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              disabled={saving}
            />
            {fileName && <span className="file-selected">{fileName}</span>}
          </label>
          <LoadingButton
            className="button"
            loading={saving}
            loadingLabel={file ? "UPLOADING QR..." : "SAVING..."}
            type="submit"
          >
            SAVE SETTINGS
          </LoadingButton>
        </form>
      )}
    </div>
  );
};

export default AdminSettings;
