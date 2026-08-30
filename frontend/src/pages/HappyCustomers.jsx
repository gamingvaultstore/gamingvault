import React from "react";
import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import FormMessage from "../components/FormMessage";
import api, { errorMessage } from "../services/api";

const HappyCustomers = () => {
  const [proofs, setProofs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProofs = async () => {
      try {
        const { data } = await api.get("/customer-proofs");
        setProofs(data);
      } catch (err) {
        setError(errorMessage(err, "Could not load customer proofs"));
      } finally {
        setLoading(false);
      }
    };

    loadProofs();
  }, []);

  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="eyebrow">Customer proof</span>
        <h1>Happy Customers</h1>
      </div>
      <FormMessage>{error}</FormMessage>
      {loading ? (
        <div className="loading-line">Loading customer proofs...</div>
      ) : proofs.length ? (
        <div className="proof-grid full">
          {proofs.map((proof) => (
            <img key={proof._id} src={proof.imageUrl} alt={proof.title} />
          ))}
        </div>
      ) : error ? null : (
        <EmptyState
          title="No customer proofs yet"
          text="Proof screenshots will appear here after the admin adds them."
        />
      )}
    </section>
  );
};

export default HappyCustomers;
