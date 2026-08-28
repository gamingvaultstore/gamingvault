import React from "react";
import { useEffect, useState } from "react";
import FormMessage from "../../components/FormMessage";
import api, { errorMessage } from "../../services/api";
import { formatCurrency, gameLabel, imageUrl } from "../../utils/format";

const emptyForm = {
  game: "BGMI",
  title: "",
  price: "",
  level: "",
  description: "",
  specifications: '{\n  "rank": "",\n  "outfits": "",\n  "weaponSkins": ""\n}',
  status: "AVAILABLE",
  featured: false,
  existingImages: [],
};

const formDataFromAccount = (form, files) => {
  const data = new FormData();
  data.append("game", form.game);
  data.append("title", form.title);
  data.append("price", form.price);
  data.append("level", form.level);
  data.append("description", form.description);
  data.append("specifications", form.specifications);
  data.append("status", form.status);
  data.append("featured", String(form.featured));
  data.append("existingImages", JSON.stringify(form.existingImages || []));

  Array.from(files || []).forEach((file) => data.append("images", file));
  return data;
};

const AdminAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState(null);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadAccounts = async () => {
    try {
      const { data } = await api.get("/admin/accounts");
      setAccounts(data);
    } catch (err) {
      setError(errorMessage(err, "Could not load accounts"));
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setFiles(null);
    setEditingId("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = formDataFromAccount(form, files);
      if (editingId) {
        await api.put(`/admin/accounts/${editingId}`, payload);
        setMessage("Account updated");
      } else {
        await api.post("/admin/accounts", payload);
        setMessage("Account added");
      }
      resetForm();
      loadAccounts();
    } catch (err) {
      setError(errorMessage(err, "Could not save account"));
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
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickUpdate = async (account, updates) => {
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
        },
        [],
      );
      await api.put(`/admin/accounts/${account._id}`, payload);
      setMessage("Account updated");
      loadAccounts();
    } catch (err) {
      setError(errorMessage(err, "Could not update account"));
    }
  };

  const deleteAccount = async (accountId) => {
    if (!window.confirm("Delete this account?")) return;
    try {
      await api.delete(`/admin/accounts/${accountId}`);
      setMessage("Account deleted");
      loadAccounts();
    } catch (err) {
      setError(errorMessage(err, "Could not delete account"));
    }
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

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
            >
              <option value="AVAILABLE">Available</option>
              <option value="SOLD">Sold</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </label>
          <label>
            Title
            <input
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
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
              required
            />
          </label>
          <label>
            Level
            <input
              value={form.level}
              onChange={(event) => update("level", event.target.value)}
              required
            />
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => update("featured", event.target.checked)}
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
            required
          />
        </label>
        <label>
          Specifications JSON
          <textarea
            value={form.specifications}
            onChange={(event) => update("specifications", event.target.value)}
            rows="6"
          />
        </label>
        <label>
          Images
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={(event) => setFiles(event.target.files)}
          />
        </label>
        {form.existingImages.length > 0 && (
          <div className="image-strip">
            {form.existingImages.map((src) => (
              <img key={src} src={imageUrl(src)} alt="" />
            ))}
          </div>
        )}
        <div className="button-row">
          <button className="button">
            {editingId ? "Save Account" : "Add Account"}
          </button>
          {editingId && (
            <button type="button" className="button ghost" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="admin-list">
        {accounts.map((account) => (
          <article className="admin-row" key={account._id}>
            <img src={imageUrl(account.images?.[0])} alt={account.title} />
            <div>
              <h3>{account.title}</h3>
              <p>
                {gameLabel(account.game)} | Level {account.level} |{" "}
                {formatCurrency(account.price)}
              </p>
              <p>
                Status: {account.status} | Featured:{" "}
                {account.featured ? "Yes" : "No"}
              </p>
            </div>
            <div className="row-actions">
              <button
                className="button small ghost"
                onClick={() => editAccount(account)}
              >
                Edit
              </button>
              <button
                className="button small ghost"
                onClick={() => quickUpdate(account, { status: "AVAILABLE" })}
              >
                Available
              </button>
              <button
                className="button small ghost"
                onClick={() => quickUpdate(account, { status: "SOLD" })}
              >
                Sold
              </button>
              <button
                className="button small ghost"
                onClick={() => quickUpdate(account, { status: "HIDDEN" })}
              >
                Hide
              </button>
              <button
                className="button small ghost"
                onClick={() =>
                  quickUpdate(account, { featured: !account.featured })
                }
              >
                {account.featured ? "Unfeature" : "Feature"}
              </button>
              <button
                className="button small danger"
                onClick={() => deleteAccount(account._id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminAccounts;
