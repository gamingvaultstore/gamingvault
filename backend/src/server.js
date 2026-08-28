require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { protect, adminOnly } = require("./middleware/auth");

const authRoutes = require("./routes/auth");
const accountRoutes = require("./routes/accounts");
const orderRoutes = require("./routes/orders");
const settingRoutes = require("./routes/settings");
const faqRoutes = require("./routes/faqs");
const customerProofRoutes = require("./routes/customerProofs");
const adminDashboardRoutes = require("./routes/admin/dashboard");
const adminAccountRoutes = require("./routes/admin/accounts");
const adminOrderRoutes = require("./routes/admin/orders");
const adminSettingRoutes = require("./routes/admin/settings");
const adminFaqRoutes = require("./routes/admin/faqs");
const adminCustomerProofRoutes = require("./routes/admin/customerProofs");

const app = express();
const port = process.env.PORT || 5000;
const frontendOrigin = (
  process.env.FRONTEND_URL || "http://localhost:5173"
).replace(/\/+$/, "");

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/customer-proofs", customerProofRoutes);

app.use("/api/admin/dashboard", protect, adminOnly, adminDashboardRoutes);
app.use("/api/admin/accounts", protect, adminOnly, adminAccountRoutes);
app.use("/api/admin/orders", protect, adminOnly, adminOrderRoutes);
app.use("/api/admin/settings", protect, adminOnly, adminSettingRoutes);
app.use("/api/admin/faqs", protect, adminOnly, adminFaqRoutes);
app.use(
  "/api/admin/customer-proofs",
  protect,
  adminOnly,
  adminCustomerProofRoutes,
);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const isUploadError =
    err.name === "MulterError" ||
    err.message === "Only JPG, PNG, and WebP images are allowed";
  const status = err.statusCode || (isUploadError ? 400 : 500);
  const message =
    status === 500 ? "Something went wrong. Please try again." : err.message;
  res.status(status).json({ message });
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`API running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
