import React from "react";
import { useEffect, useState } from "react";
import FormMessage from "../../components/FormMessage";
import api, { errorMessage } from "../../services/api";

const AdminCustomerProofs = () => {
  const [proofs, setProofs] = useState([]);
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("0");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProofs = async () => {
    try {
      const { data } = await api.get("/admin/customer-proofs");
      setProofs(data);
    } catch (err) {
      setError(errorMessage(err, "Could not load customer proofs"));
    }
  };

  useEffect(() => {
    loadProofs();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title || "Customer proof");
      formData.append("order", order);
      formData.append("image", file);
      await api.post("/admin/customer-proofs", formData);
      setTitle("");
      setOrder("0");
      setFile(null);
      setMessage("Customer proof added");
      loadProofs();
    } catch (err) {
      setError(errorMessage(err, "Could not add proof"));
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this proof?")) return;
    try {
      await api.delete(`/admin/customer-proofs/${id}`);
      setMessage("Customer proof deleted");
      loadProofs();
    } catch (err) {
      setError(errorMessage(err, "Could not delete proof"));
    }
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
          />
        </label>
        <label>
          Order
          <input
            type="number"
            value={order}
            onChange={(event) => setOrder(event.target.value)}
          />
        </label>
        <label>
          Screenshot
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setFile(event.target.files?.[0])}
            required
          />
        </label>
        <button className="button">Upload Proof</button>
      </form>

      <div className="proof-grid full">
        {proofs.map((proof) => (
          <div className="proof-item" key={proof._id}>
            <img src={proof.imageUrl} alt={proof.title} />
            <button
              className="button small danger"
              onClick={() => remove(proof._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCustomerProofs;
