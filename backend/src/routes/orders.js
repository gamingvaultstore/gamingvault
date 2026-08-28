const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrder,
  submitPayment
} = require("../controllers/orderController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(protect);
router.get("/", getMyOrders);
router.post("/", createOrder);
router.get("/:id", getOrder);
router.patch("/:id/payment", upload.single("paymentScreenshot"), submitPayment);

module.exports = router;
