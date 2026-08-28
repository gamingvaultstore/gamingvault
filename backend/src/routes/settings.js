const express = require("express");
const { getPaymentSettings } = require("../controllers/settingsController");

const router = express.Router();

router.get("/payment", getPaymentSettings);

module.exports = router;
