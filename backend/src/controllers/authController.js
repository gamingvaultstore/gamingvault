const User = require("../models/User");
const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");
const { signToken } = require("../middleware/auth");

const authResponse = (user) => ({
  token: signToken(user),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  },
});

const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  console.log("Registering user:", { name, email, phone, password });

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const user = await User.create({ name, email, phone, password });
  res.status(201).json(authResponse(user));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json(authResponse(user));
});

const forgotEmail = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: "Name and phone are required" });
  }

  const user = await User.findOne({ name: name.trim(), phone: phone.trim() });
  if (!user) {
    return res
      .status(404)
      .json({ message: "No account matched those details" });
  }

  res.json({ email: user.email });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;

  if (!email || !phone || !password) {
    return res.status(400).json({
      message: "Email, phone, and new password are required",
    });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
  }).select("+password");

  if (!user) {
    return res
      .status(404)
      .json({ message: "No account matched those details" });
  }

  user.password = password;
  await user.save();
  res.json({ message: "Password reset successfully" });
});

const me = asyncHandler(async (req, res) => {
  const totalPurchases = await Order.countDocuments({ user: req.user._id });
  const recentPurchases = await Order.find({ user: req.user._id })
    .populate("account", "title game images")
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
    },
    totalPurchases,
    recentPurchases,
  });
});

module.exports = { register, login, me, forgotEmail, resetPassword };
