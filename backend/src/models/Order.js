const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    paymentId: {
      type: String,
      trim: true,
      default: ""
    },
    paymentScreenshot: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
