const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  forgotEmail,
  login,
  me,
  register,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many auth attempts. Please try again later." },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/forgot-email", authLimiter, forgotEmail);
router.post("/reset-password", authLimiter, resetPassword);
router.get("/me", protect, me);

module.exports = router;
