import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormMessage from "../components/FormMessage";
import LoadingButton from "../components/LoadingButton";
import { SkeletonAccountDetail } from "../components/SkeletonCard";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import api, { errorMessage, isCanceledRequest } from "../services/api";
import { formatCurrency, formatSpecValue, gameLabel, imageUrl } from "../utils/format";

const statusText = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  SOLD: "Sold",
};

const AccountDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addToast } = useToast();
  const [account, setAccount] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const videoType = account?.videoUrl?.toLowerCase().includes(".webm")
    ? "video/webm"
    : "video/mp4";

  const specs = useMemo(
    () => Object.entries(account?.specifications || {}),
    [account],
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadAccount = async () => {
      setLoading(true);
      setError("");
      setVideoError(false);
      try {
        const { data } = await api.get(`/accounts/${id}`, {
          signal: controller.signal,
        });
        setAccount(data);
        setSelectedImage(data.images?.[0] || "");
      } catch (err) {
        if (isCanceledRequest(err)) return;

        const msg = errorMessage(err, "Account not found");
        setAccount(null);
        setError(msg);
        addToast(msg, "error");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadAccount();

    return () => controller.abort();
  }, [id, retryCount, addToast]);

  const buyNow = async () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: `/account/${id}` } } });
      return;
    }

    setBuying(true);
    setError("");
    try {
      const { data } = await api.post("/orders", { accountId: id });
      addToast("Order created. Complete payment to reserve delivery.", "success");
      navigate(`/payment/${data._id}`);
    } catch (err) {
      const msg = errorMessage(err, "Could not start this purchase");
      setError(msg);
      addToast(msg, "error");
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <section className="section page-section">
        <SkeletonAccountDetail />
      </section>
    );
  }

  if (!account) {
    return (
      <section className="section page-section">
        <div className="empty-state">
          <h3>{error || "Account not found"}</h3>
          <p>The account may have been removed or hidden by the admin.</p>
          <div className="button-row">
            <button
              className="button small"
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
            >
              Retry
            </button>
            <Link className="button small ghost" to="/marketplace">
              Back to Marketplace
            </Link>
          </div>
        </div>
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
              <button
                className={selectedImage === img ? "active" : ""}
                key={img}
                type="button"
                onClick={() => setSelectedImage(img)}
              >
                <img src={imageUrl(img)} alt="" />
              </button>
            ))}
          </div>
        )}
        {account.videoUrl && (
          <section className="account-showcase">
            <span className="eyebrow">Account Showcase</span>
            {videoError ? (
              <p className="video-error">
                This video could not be played. Please try refreshing the page.
              </p>
            ) : (
              <video
                controls
                playsInline
                preload="metadata"
                poster={imageUrl(account.images?.[0])}
                onError={() => setVideoError(true)}
              >
                <source src={account.videoUrl} type={videoType} />
                Your browser does not support video playback.
              </video>
            )}
          </section>
        )}
      </div>
      <div className="details-panel">
        <div className="details-meta">
          <span className={`pill ${account.game === "BGMI" ? "teal" : "gold"}`}>
            {gameLabel(account.game)}
          </span>
          <span className={`status-badge status-${account.status?.toLowerCase()}`}>
            {statusText[account.status] || "Unavailable"}
          </span>
        </div>
        <h1>{account.title}</h1>
        <div className="purchase-box">
          <div>
            <span>Price</span>
            <strong>{formatCurrency(account.price)}</strong>
          </div>
          <div>
            <span>Level</span>
            <strong>{formatSpecValue(account.level)}</strong>
          </div>
        </div>
        <p>{account.description}</p>

        {specs.length > 0 && (
          <>
            <h2 className="panel-heading">Account Highlights</h2>
            <div className="spec-table">
              {specs.map(([key, value]) => (
                <div key={key}>
                  <span>{key.replace(/([A-Z])/g, " $1")}</span>
                  <strong>{formatSpecValue(value)}</strong>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="payment-flow">
          <span>Buy</span>
          <span>Pay UPI</span>
          <span>Submit proof</span>
          <span>Admin verifies</span>
        </div>

        <FormMessage>{error}</FormMessage>

        {account.status === "AVAILABLE" ? (
          <LoadingButton
            className="button wide"
            loading={buying}
            loadingLabel="PROCESSING..."
            onClick={buyNow}
          >
            BUY NOW
          </LoadingButton>
        ) : (
          <button className="button wide disabled" disabled>
            {account.status === "RESERVED" ? "RESERVED" : "SOLD OUT"}
          </button>
        )}
      </div>
    </section>
  );
};

export default AccountDetails;
