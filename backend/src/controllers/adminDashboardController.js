const Account = require("../models/Account");
const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");

const getAdminDashboard = asyncHandler(async (req, res) => {
  const [availableAccounts, soldAccounts, pendingPayments, totalOrders] =
    await Promise.all([
      Account.countDocuments({ status: "AVAILABLE" }),
      Account.countDocuments({ status: "SOLD" }),
      Order.countDocuments({ status: "PENDING" }),
      Order.countDocuments()
    ]);

  res.json({ availableAccounts, soldAccounts, pendingPayments, totalOrders });
});

module.exports = { getAdminDashboard };
