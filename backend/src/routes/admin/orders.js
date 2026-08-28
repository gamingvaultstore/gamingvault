const express = require("express");
const {
  listOrders,
  updateOrderStatus
} = require("../../controllers/adminOrderController");

const router = express.Router();

router.get("/", listOrders);
router.patch("/:id/status", updateOrderStatus);

module.exports = router;
