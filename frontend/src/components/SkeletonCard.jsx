import React from "react";

const SkeletonCard = () => (
  <article className="account-card skeleton">
    <div className="account-card-media skeleton-media">
      <div className="skeleton-image"></div>
      <div className="skeleton-pill"></div>
    </div>
    <div className="account-card-body">
      <div
        className="skeleton-line"
        style={{ height: "20px", marginBottom: "8px" }}
      ></div>
      <div
        className="skeleton-line"
        style={{ height: "16px", marginBottom: "12px" }}
      ></div>
      <div
        className="skeleton-line"
        style={{ height: "16px", marginBottom: "12px" }}
      ></div>
      <div
        className="skeleton-line"
        style={{ height: "16px", marginBottom: "16px" }}
      ></div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <div
          className="skeleton-line"
          style={{ height: "18px", flex: 1 }}
        ></div>
        <div
          className="skeleton-line"
          style={{ height: "36px", width: "100px" }}
        ></div>
      </div>
    </div>
  </article>
);

export const SkeletonAccountDetail = () => (
  <section className="skeleton-detail-layout">
    <div className="skeleton-detail-media">
      <div
        className="skeleton-image"
        style={{ height: "300px", marginBottom: "16px" }}
      ></div>
      <div style={{ display: "flex", gap: "8px" }}>
        <div
          className="skeleton-line"
          style={{ height: "60px", width: "60px" }}
        ></div>
        <div
          className="skeleton-line"
          style={{ height: "60px", width: "60px" }}
        ></div>
        <div
          className="skeleton-line"
          style={{ height: "60px", width: "60px" }}
        ></div>
      </div>
    </div>
    <div className="skeleton-detail-panel">
      <div className="skeleton-pill" style={{ width: "80px" }}></div>
      <div
        className="skeleton-line"
        style={{ height: "28px", marginTop: "16px", marginBottom: "12px" }}
      ></div>
      <div
        className="skeleton-line"
        style={{ height: "22px", marginBottom: "16px" }}
      ></div>
      <div
        className="skeleton-line"
        style={{ height: "16px", marginBottom: "8px" }}
      ></div>
      <div
        className="skeleton-line"
        style={{ height: "16px", marginBottom: "24px" }}
      ></div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{ display: "flex", gap: "16px", marginBottom: "12px" }}
        >
          <div
            className="skeleton-line"
            style={{ height: "16px", width: "100px" }}
          ></div>
          <div
            className="skeleton-line"
            style={{ height: "16px", flex: 1 }}
          ></div>
        </div>
      ))}
      <div
        className="skeleton-line"
        style={{ height: "40px", marginTop: "24px" }}
      ></div>
    </div>
  </section>
);

export default SkeletonCard;
