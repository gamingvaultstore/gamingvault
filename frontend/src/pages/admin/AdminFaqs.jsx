import React from "react";
import { useEffect, useState } from "react";
import FormMessage from "../../components/FormMessage";
import LoadingButton from "../../components/LoadingButton";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import api, { errorMessage } from "../../services/api";

const emptyFaq = {
  question: "",
  answer: "",
  order: 0,
  active: true,
};

const AdminFaqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState(emptyFaq);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const { confirm } = useConfirm();

  const loadFaqs = async () => {
    try {
      const { data } = await api.get("/admin/faqs");
      setFaqs(data);
    } catch (err) {
      const msg = errorMessage(err, "Could not load FAQs");
      setError(msg);
      addToast(msg, "error");
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const reset = () => {
    setForm(emptyFaq);
    setEditingId("");
    setMessage("");
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      if (editingId) {
        await api.put(`/admin/faqs/${editingId}`, form);
        addToast("FAQ updated successfully", "success");
      } else {
        await api.post("/admin/faqs", form);
        addToast("FAQ added successfully", "success");
      }
      reset();
      loadFaqs();
    } catch (err) {
      const msg = errorMessage(err, "Could not save FAQ");
      setError(msg);
      addToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (faq) => {
    await confirm(
      "Delete this FAQ?",
      `Remove: "${faq.question}"? This action cannot be undone.`,
      async () => {
        try {
          await api.delete(`/admin/faqs/${faq._id}`);
          addToast("FAQ deleted successfully", "success");
          loadFaqs();
        } catch (err) {
          const msg = errorMessage(err, "Could not delete FAQ");
          addToast(msg, "error");
        }
      }
    );
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

  return (
    <div>
      <div className="section-heading">
        <span className="eyebrow">Questions</span>
        <h1>FAQs</h1>
      </div>
      <form className="admin-form compact" onSubmit={submit}>
        <h2>{editingId ? "Edit FAQ" : "Add FAQ"}</h2>
        <FormMessage type="success">{message}</FormMessage>
        <FormMessage>{error}</FormMessage>
        <label>
          Question
          <input
            value={form.question}
            onChange={(event) => update("question", event.target.value)}
            disabled={saving}
            required
          />
        </label>
        <label>
          Answer
          <textarea
            value={form.answer}
            onChange={(event) => update("answer", event.target.value)}
            rows="4"
            disabled={saving}
            required
          />
        </label>
        <label>
          Order
          <input
            type="number"
            value={form.order}
            onChange={(event) => update("order", Number(event.target.value))}
            disabled={saving}
          />
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(event) => update("active", event.target.checked)}
            disabled={saving}
          />
          Active
        </label>
        <div className="button-row">
          <LoadingButton
            className="button"
            loading={saving}
            loadingLabel="SAVING..."
            type="submit"
          >
            {editingId ? "SAVE FAQ" : "ADD FAQ"}
          </LoadingButton>
          {editingId && (
            <button className="button ghost" type="button" onClick={reset} disabled={saving}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="admin-list">
        {faqs.map((faq) => (
          <article className="admin-row" key={faq._id}>
            <div>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
              <p>
                Order: {faq.order} | Active: {faq.active ? "Yes" : "No"}
              </p>
            </div>
            <div className="row-actions">
              <button
                className="button small ghost"
                onClick={() => {
                  setEditingId(faq._id);
                  setForm({
                    question: faq.question,
                    answer: faq.answer,
                    order: faq.order,
                    active: faq.active,
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={saving}
              >
                Edit
              </button>
              <button
                className="button small danger"
                onClick={() => remove(faq)}
                disabled={saving}
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

export default AdminFaqs;
