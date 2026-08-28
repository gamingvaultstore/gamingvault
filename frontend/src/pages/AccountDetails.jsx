import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormMessage from "../components/FormMessage";
import { useAuth } from "../hooks/useAuth";
import api, { errorMessage } from "../services/api";
import { formatCurrency, gameLabel, imageUrl } from "../utils/format";

const AccountDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [account, setAccount] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAccount = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/accounts/${id}`);
        setAccount(data);
        setSelectedImage(data.images?.[0] || "");
      } catch (err) {
        setError(errorMessage(err, "Account not found"));
      } finally {
        setLoading(false);
      }
    };

    loadAccount();
  }, [id]);

  const buyNow = async () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: `/account/${id}` } } });
      return;
    }

    setBuying(true);
    setError("");
    try {
      const { data } = await api.post("/orders", { accountId: id });
      navigate(`/payment/${data._id}`);
    } catch (err) {
      setError(errorMessage(err, "Could not start this purchase"));
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return <div className="section page-section">Loading account...</div>;
  }

  if (!account) {
    return (
      <section className="section page-section">
        <FormMessage>{error || "Account not found"}</FormMessage>
        <Link className="button" to="/marketplace">
          Back to Marketplace
        </Link>
      </section>
    );
  }

  return (
    <section className="section page-section details-layout">
      <div className="details-media">
        <img
          src={imageUrl(selectedImage || account.images?.[0])}
          alt={account.title}
        />
        {account.images?.length > 1 && (
          <div className="thumb-row">
            {account.images.map((img) => (
              <button key={img} onClick={() => setSelectedImage(img)}>
                <img src={imageUrl(img)} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="details-panel">
        <span className={`pill ${account.game === "BGMI" ? "teal" : "gold"}`}>
          {gameLabel(account.game)}
        </span>
        <h1>{account.title}</h1>
        <p className="price-line">{formatCurrency(account.price)}</p>
        <p className="muted">Level {account.level}</p>
        <p>{account.description}</p>

        <div className="spec-table">
          {Object.entries(account.specifications || {}).map(([key, value]) => (
            <div key={key}>
              <span>{key.replace(/([A-Z])/g, " $1")}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        <FormMessage>{error}</FormMessage>

        {account.status === "AVAILABLE" ? (
          <button className="button wide" onClick={buyNow} disabled={buying}>
            {buying ? "Checking Availability..." : "Buy Now"}
          </button>
        ) : (
          <button className="button wide disabled" disabled>
            SOLD OUT
          </button>
        )}
      </div>
    </section>
  );
};

export default AccountDetails;
