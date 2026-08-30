import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency, formatSpecValue, gameLabel, imageUrl } from "../utils/format";

const labelFromKey = (key) => key.replace(/([A-Z])/g, " $1").trim();

const specPreview = (specifications = {}) =>
  Object.entries(specifications)
    .slice(0, 3)
    .map(([key, value]) => (
      <span key={key}>
        <strong>{labelFromKey(key)}:</strong> {formatSpecValue(value)}
      </span>
    ));

const statusLabel = {
  RESERVED: "Reserved",
  SOLD: "Sold",
  HIDDEN: "Hidden",
};

const AccountCard = ({ account }) => {
  const unavailable = account.status && account.status !== "AVAILABLE";

  return (
    <article
      className={`account-card${unavailable ? " account-card-unavailable" : ""}`}
    >
      <div className="account-card-media">
        <img src={imageUrl(account.images?.[0])} alt={account.title} />
        <span className={`pill ${account.game === "BGMI" ? "teal" : "gold"}`}>
          {gameLabel(account.game)}
        </span>
        {account.videoUrl && <span className="video-badge">Video</span>}
        {unavailable && (
          <span className="account-card-status">
            {statusLabel[account.status] || "Unavailable"}
          </span>
        )}
      </div>
      <div className="account-card-body">
        <h3>{account.title}</h3>
        <div className="spec-list">
          <span>
            <strong>Level:</strong> {formatSpecValue(account.level)}
          </span>
          {specPreview(account.specifications)}
        </div>
        <div className="account-card-footer">
          <strong>{formatCurrency(account.price)}</strong>
          <Link
            className="button small"
            to={`/account/${account._id}`}
            title={`View details of ${account.title}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default AccountCard;
