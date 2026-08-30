const Account = require("../models/Account");
const Order = require("../models/Order");
const Setting = require("../models/Setting");
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");
const { uploadToImageKit } = require("../services/imagekitService");
const { releaseExpiredReservations } = require("./accountController");

const RESERVATION_WINDOW_MS = 30 * 60 * 1000;

const populateOrder = (query) =>
  query
    .populate("account", "game title price level images status")
    .populate("user", "name email phone");

const createOrder = asyncHandler(async (req, res) => {
  const { accountId } = req.body;

  if (!accountId) {
    return res.status(400).json({ message: "Account is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(accountId)) {
    return res.status(400).json({ message: "Invalid account selected" });
  }

  await releaseExpiredReservations();
  const now = new Date();
  const reservedUntil = new Date(now.getTime() + RESERVATION_WINDOW_MS);
  const account = await Account.findOneAndUpdate(
    {
      _id: accountId,
      $or: [
        { status: "AVAILABLE" },
        { status: "RESERVED", reservedUntil: { $lte: now } },
      ],
    },
    { status: "RESERVED", reservedUntil },
    { new: true }
  );

  if (!account) {
    return res
      .status(409)
      .json({ message: "This account is no longer available" });
  }

  let order;
  try {
    order = await Order.create({
      user: req.user._id,
      account: account._id,
      amount: account.price
    });
  } catch (error) {
    await Account.findOneAndUpdate(
      { _id: account._id, status: "RESERVED", reservedUntil },
      { status: "AVAILABLE", reservedUntil: null },
    );
    throw error;
  }

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

  if (order.paymentId || order.paymentScreenshot) {
    return res
      .status(400)
      .json({ message: "Payment details have already been submitted" });
  }

  const account = await Account.findById(order.account);
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  const reservationExpired =
    account.status === "RESERVED" &&
    account.reservedUntil &&
    account.reservedUntil.getTime() <= Date.now();

  if (account.status === "AVAILABLE" || reservationExpired) {
    await Account.findOneAndUpdate(
      { _id: account._id, status: "RESERVED" },
      { status: "AVAILABLE", reservedUntil: null },
    );
    return res
      .status(409)
      .json({ message: "This account reservation has expired" });
  }

  const uploaded = await uploadToImageKit(req.file, "/payment-screenshots");
  order.paymentId = paymentId.trim();
  order.paymentScreenshot = uploaded.url;
  await order.save();
  await Account.findOneAndUpdate(
    { _id: order.account, status: "RESERVED" },
    { reservedUntil: null },
  );

  res.json({
    message: "Payment details submitted successfully",
    orderId: order._id
  });
});

module.exports = { createOrder, getMyOrders, getOrder, submitPayment };
