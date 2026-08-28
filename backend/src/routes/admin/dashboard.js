const express = require("express");
const {
  getAdminDashboard
} = require("../../controllers/adminDashboardController");

const router = express.Router();

router.get("/", getAdminDashboard);

module.exports = router;
