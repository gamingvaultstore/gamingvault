import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency, gameLabel, imageUrl } from "../utils/format";

const specPreview = (specifications = {}) =>
  Object.entries(specifications)
    .slice(0, 3)
    .map(([key, value]) => (
      <span key={key}>
        {key.replace(/([A-Z])/g, " $1")}: {value}
      </span>
    ));

const AccountCard = ({ account }) => (
  <article className="account-card">
    <div className="account-card-media">
      <img src={imageUrl(account.images?.[0])} alt={account.title} />
      <span className={`pill ${account.game === "BGMI" ? "teal" : "gold"}`}>
        {gameLabel(account.game)}
      </span>
    </div>
    <div className="account-card-body">
      <h3>{account.title}</h3>
      <div className="spec-list">
        <span>Level {account.level}</span>
        {specPreview(account.specifications)}
      </div>
      <div className="account-card-footer">
        <strong>{formatCurrency(account.price)}</strong>
        <Link className="button small" to={`/account/${account._id}`}>
          View Details
        </Link>
      </div>
    </div>
  </article>
);

export default AccountCard;
