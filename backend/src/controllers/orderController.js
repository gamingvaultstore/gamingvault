const Account = require("../models/Account");
const Order = require("../models/Order");
const Setting = require("../models/Setting");
const asyncHandler = require("../utils/asyncHandler");
const { uploadToImageKit } = require("../services/imagekitService");

const populateOrder = (query) =>
  query
    .populate("account", "game title price level images status")
    .populate("user", "name email phone");

const createOrder = asyncHandler(async (req, res) => {
  const { accountId } = req.body;

  if (!accountId) {
    return res.status(400).json({ message: "Account is required" });
  }

  const account = await Account.findOneAndUpdate(
    { _id: accountId, status: "AVAILABLE" },
    { status: "SOLD" },
    { new: true }
  );

  if (!account) {
    return res
      .status(409)
      .json({ message: "This account is no longer available" });
  }

  const order = await Order.create({
    user: req.user._id,
    account: account._id,
    amount: account.price
  });

  const populatedOrder = await populateOrder(Order.findById(order._id));
  res.status(201).json(populatedOrder);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await populateOrder(
    Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  );

  res.json(orders);
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await populateOrder(
    Order.findOne({ _id: req.params.id, user: req.user._id })
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const paymentSettings = await Setting.findOne({ key: "payment" });
  res.json({ order, paymentSettings });
});

const submitPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.body;

  if (!paymentId || !paymentId.trim()) {
    return res.status(400).json({ message: "Payment ID / UTR is required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Payment screenshot is required" });
  }

  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status !== "PENDING") {
    return res.status(400).json({ message: "This order is already reviewed" });
  }

  const uploaded = await uploadToImageKit(req.file, "/payment-screenshots");
  order.paymentId = paymentId.trim();
  order.paymentScreenshot = uploaded.url;
  await order.save();

  res.json({
    message: "Payment details submitted successfully",
    orderId: order._id
  });
});

module.exports = { createOrder, getMyOrders, getOrder, submitPayment };
