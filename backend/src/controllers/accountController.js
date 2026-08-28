const Account = require("../models/Account");
const asyncHandler = require("../utils/asyncHandler");

const gameFromParam = (value) => {
  if (!value) return undefined;
  if (value === "bgmi" || value === "BGMI") return "BGMI";
  if (value === "free-fire" || value === "FREE_FIRE") return "FREE_FIRE";
  return value;
};

const buildPublicAccountQuery = (query) => {
  const filter = { status: "AVAILABLE" };

  if (query.game) {
    filter.game = gameFromParam(query.game);
  }

  if (query.featured === "true") {
    filter.featured = true;
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  return filter;
};

const sortFromQuery = (sort) => {
  if (sort === "price_asc") return { price: 1 };
  if (sort === "price_desc") return { price: -1 };
  return { createdAt: -1 };
};

const getAccounts = asyncHandler(async (req, res) => {
  const accounts = await Account.find(buildPublicAccountQuery(req.query)).sort(
    sortFromQuery(req.query.sort)
  );

  res.json(accounts);
});

const getAccount = asyncHandler(async (req, res) => {
  const account = await Account.findOne({
    _id: req.params.id,
    status: { $ne: "HIDDEN" }
  });

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  res.json(account);
});

module.exports = { getAccounts, getAccount, gameFromParam, sortFromQuery };
