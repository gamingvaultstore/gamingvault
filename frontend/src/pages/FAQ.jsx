import React from "react";
import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import FormMessage from "../components/FormMessage";
import api, { errorMessage } from "../services/api";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const { data } = await api.get("/faqs");
        setFaqs(data);
      } catch (err) {
        setError(errorMessage(err, "Could not load FAQs"));
      }
    };

    loadFaqs();
  }, []);

  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="eyebrow">Questions</span>
        <h1>FAQ</h1>
      </div>
      <FormMessage>{error}</FormMessage>
      {faqs.length ? (
        <div className="faq-list wide">
          {faqs.map((faq) => (
            <details key={faq._id}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No FAQs yet"
          text="Questions will appear here soon."
        />
      )}
    </section>
  );
};

export default FAQ;
