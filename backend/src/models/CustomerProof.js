const mongoose = require("mongoose");

const customerProofSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Customer proof",
      trim: true
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    active: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerProof", customerProofSchema);
