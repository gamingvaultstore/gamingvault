const Account = require("../models/Account");
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");

const badRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  throw error;
};

const gameFromParam = (value) => {
  if (!value) return undefined;
  const normalized = String(value).trim().toLowerCase();
  if (normalized === "bgmi") return "BGMI";
  if (normalized === "free-fire" || normalized === "free_fire") {
    return "FREE_FIRE";
  }
  return undefined;
};

const parsePriceFilter = (value, label) => {
  if (value === undefined || value === null || value === "") return undefined;

  const price = Number(value);
  if (!Number.isFinite(price) || price < 0) {
    badRequest(`${label} must be a valid positive number`);
  }

  return price;
};

const buildPublicAccountQuery = (query) => {
  const filter = { status: "AVAILABLE" };

  if (query.game) {
    const game = gameFromParam(query.game);
    if (!game) badRequest("Game filter must be BGMI or Free Fire");
    filter.game = game;
  }

  if (query.featured !== undefined) {
    if (!["true", "false"].includes(query.featured)) {
      badRequest("Featured filter must be true or false");
    }
    filter.featured = query.featured === "true";
  }

  const minPrice = parsePriceFilter(query.minPrice, "Minimum price");
  const maxPrice = parsePriceFilter(query.maxPrice, "Maximum price");

  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    minPrice > maxPrice
  ) {
    badRequest("Minimum price cannot be greater than maximum price");
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  return filter;
};

const sortFromQuery = (sort) => {
  if (!sort || sort === "newest") return { createdAt: -1 };
  if (sort === "price_asc") return { price: 1 };
  if (sort === "price_desc") return { price: -1 };
  badRequest("Invalid sort option");
};

const releaseExpiredReservations = async () => {
  await Account.updateMany(
    { status: "RESERVED", reservedUntil: { $lte: new Date() } },
    { status: "AVAILABLE", reservedUntil: null },
  );
};

const getAccounts = asyncHandler(async (req, res) => {
  await releaseExpiredReservations();

  const accounts = await Account.find(buildPublicAccountQuery(req.query)).sort(
    sortFromQuery(req.query.sort)
  );

  res.json(accounts);
});

const getAccount = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Account not found" });
  }

  await releaseExpiredReservations();

  const account = await Account.findOne({
    _id: req.params.id,
    status: { $ne: "HIDDEN" }
  });

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  res.json(account);
});

module.exports = {
  getAccounts,
  getAccount,
  gameFromParam,
  sortFromQuery,
  releaseExpiredReservations,
};
