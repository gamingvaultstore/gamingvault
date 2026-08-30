import React from "react";
import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import FormMessage from "../../components/FormMessage";
import LoadingButton from "../../components/LoadingButton";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import api, { errorMessage, isCanceledRequest } from "../../services/api";
import { formatCurrency, gameLabel, imageUrl } from "../../utils/format";

const freshForm = () => ({
  game: "BGMI",
  title: "",
  price: "",
  level: "",
  description: "",
  specifications: '{\n  "rank": "",\n  "outfits": "",\n  "weaponSkins": ""\n}',
  status: "AVAILABLE",
  featured: false,
  existingImages: [],
  videoUrl: "",
  removeVideo: false,
});

const formDataFromAccount = (form, files, videoFile) => {
  const data = new FormData();
  data.append("game", form.game);
  data.append("title", form.title.trim());
  data.append("price", form.price);
  data.append("level", String(form.level).trim());
  data.append("description", form.description.trim());
  data.append("specifications", form.specifications);
  data.append("status", form.status);
  data.append("featured", String(form.featured));
  data.append("existingImages", JSON.stringify(form.existingImages || []));
  data.append("removeVideo", String(form.removeVideo));

  Array.from(files || []).forEach((file) => data.append("images", file));
  if (videoFile?.[0]) data.append("video", videoFile[0]);
  return data;
};

const rowActionLabel = (updating, action, label) =>
  updating === action ? "Updating..." : label;

const AdminAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState(freshForm);
  const [files, setFiles] = useState(null);
  const [fileNames, setFileNames] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoFileName, setVideoFileName] = useState("");
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [listLoading, setListLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState({});
  const { addToast } = useToast();
  const { confirm } = useConfirm();

  const loadAccounts = async (signal) => {
    setListLoading(accounts.length === 0);
    try {
      const { data } = await api.get("/admin/accounts", { signal });
      setAccounts(data);
    } catch (err) {
      if (isCanceledRequest(err)) return;

      const msg = errorMessage(err, "Could not load accounts");
      setError(msg);
      addToast(msg, "error");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadAccounts(controller.signal);
    return () => controller.abort();
  }, []);

  const resetForm = () => {
    setForm(freshForm());
    setFiles(null);
    setFileNames([]);
    setVideoFile(null);
    setVideoFileName("");
    setEditingId("");
    setMessage("");
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      JSON.parse(form.specifications || "{}");
    } catch {
      const msg = "Specifications must be valid JSON.";
      setError(msg);
      addToast(msg, "error");
      return;
    }

    setSaving(true);

    try {
      const payload = formDataFromAccount(form, files, videoFile);
      if (editingId) {
        await api.put(`/admin/accounts/${editingId}`, payload);
        setMessage("Account updated successfully");
        addToast("Account updated successfully", "success");
      } else {
        await api.post("/admin/accounts", payload);
        setMessage("Account added successfully");
        addToast("Account added successfully", "success");
      }
      resetForm();
      await loadAccounts();
    } catch (err) {
      const msg = errorMessage(err, "Could not save account");
      setError(msg);
      addToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  const editAccount = (account) => {
    setEditingId(account._id);
    setForm({
      game: account.game,
      title: account.title,
      price: account.price,
      level: account.level,
      description: account.description,
      specifications: JSON.stringify(account.specifications || {}, null, 2),
      status: account.status,
      featured: account.featured,
      existingImages: account.images || [],
      videoUrl: account.videoUrl || "",
      removeVideo: false,
    });
    setFiles(null);
    setFileNames([]);
    setVideoFile(null);
    setVideoFileName("");
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickUpdate = async (account, updates, action) => {
    setUpdating((prev) => ({ ...prev, [account._id]: action }));
    setError("");
    setMessage("");
    try {
      const payload = formDataFromAccount(
        {
          game: account.game,
          title: account.title,
          price: account.price,
          level: account.level,
          description: account.description,
          specifications: JSON.stringify(account.specifications || {}),
          status: updates.status || account.status,
          featured:
            updates.featured !== undefined
              ? updates.featured
              : account.featured,
          existingImages: account.images || [],
          removeVideo: false,
        },
        [],
      );
      await api.put(`/admin/accounts/${account._id}`, payload);
      addToast("Account updated", "success");
      await loadAccounts();
    } catch (err) {
      const msg = errorMessage(err, "Could not update account");
      setError(msg);
      addToast(msg, "error");
    } finally {
      setUpdating((prev) => ({ ...prev, [account._id]: "" }));
    }
  };

  const deleteAccount = async (account) => {
    await confirm(
      "Delete this account?",
      `This will remove "${account.title}" from the marketplace. This action cannot be undone.`,
      async () => {
        setUpdating((prev) => ({ ...prev, [account._id]: "delete" }));
        try {
          await api.delete(`/admin/accounts/${account._id}`);
          addToast("Account deleted successfully", "success");
          await loadAccounts();
        } catch (err) {
          const msg = errorMessage(err, "Could not delete account");
          setError(msg);
          addToast(msg, "error");
        } finally {
          setUpdating((prev) => ({ ...prev, [account._id]: "" }));
        }
      },
    );
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

  const updateImageFiles = (event) => {
    const nextFiles = event.target.files;
    setFiles(nextFiles);
    setFileNames(Array.from(nextFiles || []).map((file) => file.name));
  };

  const updateVideoFile = (event) => {
    const nextFiles = event.target.files;
    setVideoFile(nextFiles);
    setVideoFileName(nextFiles?.[0]?.name || "");
  };

  return (
    <div>
      <div className="section-heading">
        <span className="eyebrow">Inventory</span>
        <h1>Accounts</h1>
      </div>

      <form className="admin-form" onSubmit={submit}>
        <h2>{editingId ? "Edit Account" : "Add Account"}</h2>
        <FormMessage type="success">{message}</FormMessage>
        <FormMessage>{error}</FormMessage>
        <div className="form-grid">
          <label>
            Game
            <select
              value={form.game}
              onChange={(event) => update("game", event.target.value)}
              disabled={saving}
            >
              <option value="BGMI">BGMI</option>
              <option value="FREE_FIRE">Free Fire</option>
            </select>
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(event) => update("status", event.target.value)}
              disabled={saving}
            >
              <option value="AVAILABLE">Available</option>
              <option value="RESERVED">Reserved</option>
              <option value="SOLD">Sold</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </label>
          <label>
            Title
            <input
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              disabled={saving}
              required
            />
          </label>
          <label>
            Price
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(event) => update("price", event.target.value)}
              disabled={saving}
              required
            />
          </label>
          <label>
            Level
            <input
              value={form.level}
              onChange={(event) => update("level", event.target.value)}
              disabled={saving}
              required
            />
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => update("featured", event.target.checked)}
              disabled={saving}
            />
            Featured
          </label>
        </div>
        <label>
          Description
          <textarea
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            rows="3"
            disabled={saving}
            required
          />
        </label>
        <label>
          Specifications JSON
          <textarea
            value={form.specifications}
            onChange={(event) => update("specifications", event.target.value)}
            rows="6"
            disabled={saving}
          />
        </label>
        <label>
          Images
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={updateImageFiles}
            disabled={saving}
          />
          {fileNames.length > 0 && (
            <span className="file-selected">{fileNames.join(", ")}</span>
          )}
        </label>
        <label>
          Account Video
          <input
            type="file"
            accept="video/mp4,video/webm"
            onChange={updateVideoFile}
            disabled={saving}
          />
          {videoFileName && (
            <span className="file-selected">{videoFileName}</span>
          )}
        </label>
        {form.videoUrl && (
          <div className="video-admin-options">
            <video src={form.videoUrl} controls />
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.removeVideo}
                onChange={(event) =>
                  update("removeVideo", event.target.checked)
                }
                disabled={saving}
              />
              Remove existing video
            </label>
          </div>
        )}
        {form.existingImages.length > 0 && (
          <div className="image-strip">
            {form.existingImages.map((src) => (
              <img key={src} src={imageUrl(src)} alt="" />
            ))}
          </div>
        )}
        <div className="button-row">
          <LoadingButton
            className="button"
            loading={saving}
            loadingLabel={
              files || videoFile ? "UPLOADING MEDIA..." : "SAVING..."
            }
            type="submit"
          >
            {editingId ? "SAVE ACCOUNT" : "ADD ACCOUNT"}
          </LoadingButton>
          {editingId && (
            <button
              type="button"
              className="button ghost"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {listLoading ? (
        <div className="loading-line">Loading accounts...</div>
      ) : accounts.length ? (
        <div className="admin-list">
          {accounts.map((account) => {
            const action = updating[account._id];
            return (
              <article className="admin-row" key={account._id}>
                <img src={imageUrl(account.images?.[0])} alt={account.title} />
                <div>
                  <h3>{account.title}</h3>
                  <p>
                    {gameLabel(account.game)} | Level {account.level} |{" "}
                    {formatCurrency(account.price)}
                  </p>
                  <p>
                    Status: <strong>{account.status}</strong> | Featured:{" "}
                    {account.featured ? "Yes" : "No"}
                  </p>
                  {account.videoUrl && <p>Video: uploaded</p>}
                </div>
                <div className="row-actions">
                  <button
                    className="button small ghost"
                    onClick={() => editAccount(account)}
                    disabled={Boolean(action)}
                  >
                    Edit
                  </button>
                  <button
                    className="button small ghost"
                    onClick={() =>
                      quickUpdate(account, { status: "AVAILABLE" }, "available")
                    }
                    disabled={Boolean(action)}
                  >
                    {rowActionLabel(action, "available", "Available")}
                  </button>
                  <button
                    className="button small ghost"
                    onClick={() =>
                      quickUpdate(account, { status: "SOLD" }, "sold")
                    }
                    disabled={Boolean(action)}
                  >
                    {rowActionLabel(action, "sold", "Sold")}
                  </button>
                  <button
                    className="button small ghost"
                    onClick={() =>
                      quickUpdate(account, { status: "HIDDEN" }, "hidden")
                    }
                    disabled={Boolean(action)}
                  >
                    {rowActionLabel(action, "hidden", "Hide")}
                  </button>
                  <button
                    className="button small ghost"
                    onClick={() =>
                      quickUpdate(
                        account,
                        { featured: !account.featured },
                        "featured",
                      )
                    }
                    disabled={Boolean(action)}
                  >
                    {rowActionLabel(
                      action,
                      "featured",
                      account.featured ? "Unfeature" : "Feature",
                    )}
                  </button>
                  <button
                    className="button small danger"
                    onClick={() => deleteAccount(account)}
                    disabled={Boolean(action)}
                  >
                    {rowActionLabel(action, "delete", "Delete")}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No accounts yet"
          text="Add the first gaming account from the form above."
        />
      )}
    </div>
  );
};

export default AdminAccounts;
