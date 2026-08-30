import React from "react";
import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import FormMessage from "../../components/FormMessage";
import LoadingButton from "../../components/LoadingButton";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import api, { errorMessage } from "../../services/api";

const AdminCustomerProofs = () => {
  const [proofs, setProofs] = useState([]);
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("0");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const { addToast } = useToast();
  const { confirm } = useConfirm();

  const loadProofs = async () => {
    setLoading(proofs.length === 0);
    try {
      const { data } = await api.get("/admin/customer-proofs");
      setProofs(data);
    } catch (err) {
      const msg = errorMessage(err, "Could not load customer proofs");
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProofs();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!file) {
      const msg = "Customer proof screenshot is required.";
      setError(msg);
      addToast(msg, "warning");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", title || "Customer proof");
      formData.append("order", order);
      formData.append("image", file);
      await api.post("/admin/customer-proofs", formData);
      setTitle("");
      setOrder("0");
      setFile(null);
      setFileName("");
      setMessage("Customer proof uploaded successfully");
      addToast("Customer proof uploaded successfully", "success");
      await loadProofs();
    } catch (err) {
      const msg = errorMessage(err, "Could not upload proof");
      setError(msg);
      addToast(msg, "error");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (proof) => {
    await confirm(
      "Delete this proof?",
      `Remove: "${proof.title}"? This action cannot be undone.`,
      async () => {
        setDeletingId(proof._id);
        try {
          await api.delete(`/admin/customer-proofs/${proof._id}`);
          addToast("Customer proof deleted successfully", "success");
          await loadProofs();
        } catch (err) {
          const msg = errorMessage(err, "Could not delete proof");
          setError(msg);
          addToast(msg, "error");
        } finally {
          setDeletingId("");
        }
      },
    );
  };

  const onFileChange = (event) => {
    const nextFile = event.target.files?.[0] || null;
    setFile(nextFile);
    setFileName(nextFile?.name || "");
    setMessage("");
  };

  return (
    <div>
      <div className="section-heading">
        <span className="eyebrow">Proofs</span>
        <h1>Customer Proofs</h1>
      </div>
      <form className="admin-form compact" onSubmit={submit}>
        <FormMessage type="success">{message}</FormMessage>
        <FormMessage>{error}</FormMessage>
        <label>
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g., Account Purchase Verification"
            disabled={uploading}
          />
        </label>
        <label>
          Order
          <input
            type="number"
            value={order}
            onChange={(event) => setOrder(event.target.value)}
            disabled={uploading}
          />
        </label>
        <label>
          Screenshot <span className="required-mark">*</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onFileChange}
            disabled={uploading}
            required
          />
          {fileName && <span className="file-selected">{fileName}</span>}
        </label>
        <LoadingButton
          className="button"
          loading={uploading}
          loadingLabel="UPLOADING..."
          type="submit"
        >
          UPLOAD PROOF
        </LoadingButton>
      </form>

      {loading ? (
        <div className="loading-line">Loading customer proofs...</div>
      ) : proofs.length ? (
        <div className="proof-grid full">
          {proofs.map((proof) => (
            <div className="proof-item" key={proof._id}>
              <img src={proof.imageUrl} alt={proof.title} />
              <button
                className="button small danger"
                onClick={() => remove(proof)}
                disabled={deletingId === proof._id}
              >
                {deletingId === proof._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      ) : error ? null : (
        <EmptyState
          title="No customer proofs yet"
          text="Upload screenshots to show customer payment or delivery proof."
        />
      )}
    </div>
  );
};

export default AdminCustomerProofs;
