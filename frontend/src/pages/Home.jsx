import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountCard from "../components/AccountCard";
import EmptyState from "../components/EmptyState";
import api from "../services/api";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHome = async () => {
      try {
        const [accountsRes, proofsRes, faqsRes] = await Promise.all([
          api.get("/accounts?featured=true"),
          api.get("/customer-proofs"),
          api.get("/faqs"),
        ]);
        setFeatured(accountsRes.data.slice(0, 4));
        setProofs(proofsRes.data.slice(0, 3));
        setFaqs(faqsRes.data.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    loadHome();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-image" />
        <div className="hero-inner">
          <span className="eyebrow">BGMI and Free Fire accounts</span>
          <h1>Premium Gaming Accounts. Ready to Play.</h1>
          <p>
            Browse admin-listed gaming accounts, pay manually with UPI, and
            submit your payment proof for verification.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/marketplace">
              Browse Marketplace
            </Link>
            <Link className="button ghost" to="/marketplace/bgmi">
              Explore BGMI
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Choose your game</span>
          <h2>Game Selection</h2>
        </div>
        <div className="game-grid">
          <Link className="game-card bgmi" to="/marketplace/bgmi">
            <span>BGMI</span>
            <p>Browse BGMI accounts.</p>
          </Link>
          <Link className="game-card free-fire" to="/marketplace/free-fire">
            <span>FREE FIRE</span>
            <p>Browse Free Fire accounts.</p>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-heading inline">
          <div>
            <span className="eyebrow">Fresh picks</span>
            <h2>Featured Accounts</h2>
          </div>
          <Link className="button ghost small" to="/marketplace">
            View All
          </Link>
        </div>
        {loading ? (
          <div className="loading-line">Loading accounts...</div>
        ) : featured.length ? (
          <div className="account-grid">
            {featured.map((account) => (
              <AccountCard key={account._id} account={account} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No featured accounts"
            text="Featured accounts will appear here when the admin marks them."
          />
        )}
      </section>

      <section className="section muted-band">
        <div className="section-heading">
          <span className="eyebrow">Simple buying flow</span>
          <h2>Why Choose Us</h2>
        </div>
        <div className="reason-grid">
          <div>
            <h3>Carefully listed accounts</h3>
            <p>Accounts are added and managed by the marketplace admin.</p>
          </div>
          <div>
            <h3>Manual payment verification</h3>
            <p>
              Every UPI payment is checked before delivery details are shared.
            </p>
          </div>
          <div>
            <h3>Direct customer support</h3>
            <p>Admin support continues on WhatsApp after payment review.</p>
          </div>
          <div>
            <h3>Fast manual delivery</h3>
            <p>Verified orders are handled personally by the admin.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading inline">
          <div>
            <span className="eyebrow">Recent buyers</span>
            <h2>Happy Customers</h2>
          </div>
          <Link className="button ghost small" to="/happy-customers">
            View All
          </Link>
        </div>
        <div className="proof-grid">
          {proofs.map((proof) => (
            <img key={proof._id} src={proof.imageUrl} alt={proof.title} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading inline">
          <div>
            <span className="eyebrow">Answers</span>
            <h2>FAQ Preview</h2>
          </div>
          <Link className="button ghost small" to="/faq">
            View FAQ
          </Link>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq._id}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
