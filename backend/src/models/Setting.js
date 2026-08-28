const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "payment"
    },
    upiId: {
      type: String,
      required: true,
      trim: true
    },
    qrCodeUrl: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);
