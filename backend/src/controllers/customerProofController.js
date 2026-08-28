const CustomerProof = require("../models/CustomerProof");
const asyncHandler = require("../utils/asyncHandler");
const { uploadToImageKit } = require("../services/imagekitService");

const getCustomerProofs = asyncHandler(async (req, res) => {
  const proofs = await CustomerProof.find({ active: true }).sort({
    order: 1,
    createdAt: -1
  });

  res.json(proofs);
});

const getAdminCustomerProofs = asyncHandler(async (req, res) => {
  const proofs = await CustomerProof.find().sort({ order: 1, createdAt: -1 });
  res.json(proofs);
});

const createCustomerProof = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Customer proof image is required" });
  }

  const uploaded = await uploadToImageKit(req.file, "/customer-proofs");
  const proof = await CustomerProof.create({
    title: req.body.title || "Customer proof",
    imageUrl: uploaded.url,
    active: req.body.active !== "false",
    order: Number(req.body.order || 0)
  });

  res.status(201).json(proof);
});

const deleteCustomerProof = asyncHandler(async (req, res) => {
  const proof = await CustomerProof.findByIdAndDelete(req.params.id);

  if (!proof) {
    return res.status(404).json({ message: "Customer proof not found" });
  }

  res.json({ message: "Customer proof deleted" });
});

module.exports = {
  getCustomerProofs,
  getAdminCustomerProofs,
  createCustomerProof,
  deleteCustomerProof
};
