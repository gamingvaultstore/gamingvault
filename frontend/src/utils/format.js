export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount || 0);

export const gameLabel = (game) => {
  if (game === "FREE_FIRE") return "Free Fire";
  return game || "Game";
};

export const gamePath = (game) => {
  if (game === "FREE_FIRE") return "free-fire";
  return "bgmi";
};

export const imageUrl = (src) => src || "/placeholders/account-default.svg";

export const orderDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(new Date(date))
    : "";
