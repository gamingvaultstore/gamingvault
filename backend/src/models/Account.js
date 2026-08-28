const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    game: {
      type: String,
      enum: ["BGMI", "FREE_FIRE"],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    level: {
      type: String,
      required: true,
      trim: true
    },
    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    images: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "SOLD", "HIDDEN"],
      default: "AVAILABLE"
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);
