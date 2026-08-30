const Account = require("../models/Account");
const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");

const listOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const orders = await Order.find(filter)
    .populate("user", "name email phone")
    .populate("account", "title game images status")
    .sort({ createdAt: -1 });

  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["VERIFIED", "REJECTED"].includes(status)) {
    return res
      .status(400)
      .json({ message: "Status must be VERIFIED or REJECTED" });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status !== "PENDING") {
    return res
      .status(400)
      .json({ message: "This order has already been reviewed" });
  }

  order.status = status;
  await order.save();

  if (status === "VERIFIED") {
    await Account.findByIdAndUpdate(order.account, {
      status: "SOLD",
      reservedUntil: null,
    });
  }

  if (status === "REJECTED") {
    await Account.findOneAndUpdate(
      { _id: order.account, status: { $in: ["RESERVED", "SOLD"] } },
      { status: "AVAILABLE", reservedUntil: null },
    );
  }

  const populated = await Order.findById(order._id)
    .populate("user", "name email phone")
    .populate("account", "title game images status");

  res.json(populated);
});

module.exports = { listOrders, updateOrderStatus };
