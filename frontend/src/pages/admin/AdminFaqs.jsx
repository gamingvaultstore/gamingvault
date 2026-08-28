import React from "react";
import { useEffect, useState } from "react";
import FormMessage from "../../components/FormMessage";
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

  const loadFaqs = async () => {
    try {
      const { data } = await api.get("/admin/faqs");
      setFaqs(data);
    } catch (err) {
      setError(errorMessage(err, "Could not load FAQs"));
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const reset = () => {
    setForm(emptyFaq);
    setEditingId("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingId) {
        await api.put(`/admin/faqs/${editingId}`, form);
        setMessage("FAQ updated");
      } else {
        await api.post("/admin/faqs", form);
        setMessage("FAQ added");
      }
      reset();
      loadFaqs();
    } catch (err) {
      setError(errorMessage(err, "Could not save FAQ"));
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;
    try {
      await api.delete(`/admin/faqs/${id}`);
      setMessage("FAQ deleted");
      loadFaqs();
    } catch (err) {
      setError(errorMessage(err, "Could not delete FAQ"));
    }
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
            required
          />
        </label>
        <label>
          Answer
          <textarea
            value={form.answer}
            onChange={(event) => update("answer", event.target.value)}
            rows="4"
            required
          />
        </label>
        <label>
          Order
          <input
            type="number"
            value={form.order}
            onChange={(event) => update("order", Number(event.target.value))}
          />
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(event) => update("active", event.target.checked)}
          />
          Active
        </label>
        <div className="button-row">
          <button className="button">
            {editingId ? "Save FAQ" : "Add FAQ"}
          </button>
          {editingId && (
            <button className="button ghost" type="button" onClick={reset}>
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
              >
                Edit
              </button>
              <button
                className="button small danger"
                onClick={() => remove(faq._id)}
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
