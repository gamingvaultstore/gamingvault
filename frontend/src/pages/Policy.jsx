import React from "react";

const policies = {
  terms: {
    label: "Legal",
    title: "Terms & Conditions",
    sections: [
      [
        "Agreement to Terms",
        "By accessing our website, you agree to be bound by these terms and conditions. If you do not agree, please do not use our services.",
      ],
      [
        "Digital Goods",
        "We sell digital products including gaming accounts and virtual currency (UC). Once the digital product is delivered, the sale is final.",
      ],
      [
        "Account Safety",
        "While we ensure the safety of the accounts sold, we are not responsible for any actions taken by game developers (bans/restrictions) after the account is successfully transferred to the buyer.",
      ],
      [
        "User Obligations",
        "Users must provide accurate information for UID top-ups. We are not responsible for UC sent to incorrect UIDs provided by the user.",
      ],
      [
        "Modifications",
        "We reserve the right to modify these terms at any time without prior notice.",
      ],
    ],
  },
  privacy: {
    label: "Legal",
    title: "Privacy Policy",
    sections: [
      [
        "Information Collection",
        "We collect basic information such as your name, mobile number, and email to process your orders and provide support.",
      ],
      [
        "Data Usage",
        "Your data is used solely for order processing, account management, and occasional promotional updates if you opt-in.",
      ],
      [
        "Payment Security",
        "We do not store your credit card or payment details. All transactions are processed through secure third-party payment gateways.",
      ],
      [
        "Third-Party Sharing",
        "We do not sell or share your personal information with third parties for marketing purposes.",
      ],
      [
        "Cookies",
        "We use cookies to enhance your browsing experience and remember your login session.",
      ],
    ],
  },
  refund: {
    label: "Legal",
    title: "Refund Policy",
    sections: [
      [
        "Digital Goods Non-Refundable",
        "Due to the nature of digital products (accounts and UC top-ups), all sales are final. Refunds are only issued under specific conditions mentioned below.",
      ],
      [
        "Failed Deliveries",
        "If you have paid for an item but did not receive it due to a technical error on our part, we will first attempt to fulfill the order. If we cannot, a full refund will be issued to your wallet or original payment source.",
      ],
      [
        "Wrong UID Top-ups",
        "We are NOT responsible for refunds if you provide an incorrect Player UID for UC top-ups, as the transaction is irreversible on the game server.",
      ],
      [
        "Account Issues",
        'If a purchased account is found to be "Already Sold" or inaccessible at the time of purchase, we will provide a replacement or a full refund.',
      ],
      ["Refund Timeline", "Approved refunds are processed within 24-48 hours."],
    ],
  },
};

const Policy = ({ type }) => {
  const policy = policies[type];

  return (
    <section className="section page-section policy-page">
      <div className="section-heading">
        <span className="eyebrow">{policy.label}</span>
        <h1>{policy.title}</h1>
      </div>
      <div className="policy-list">
        {policy.sections.map(([heading, text], index) => (
          <article className="policy-section" key={heading}>
            <h2>
              {index + 1}. {heading}
            </h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export const Terms = () => <Policy type="terms" />;
export const Privacy = () => <Policy type="privacy" />;
export const Refund = () => <Policy type="refund" />;

export default Policy;
