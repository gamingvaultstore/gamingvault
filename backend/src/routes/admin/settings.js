const express = require("express");
const {
  getPaymentSettings,
  updatePaymentSettings
} = require("../../controllers/settingsController");
const upload = require("../../middleware/upload");

const router = express.Router();

router.get("/payment", getPaymentSettings);
router.put("/payment", upload.single("qrCode"), updatePaymentSettings);

module.exports = router;
