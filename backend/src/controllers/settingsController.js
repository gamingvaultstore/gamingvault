const Setting = require("../models/Setting");
const asyncHandler = require("../utils/asyncHandler");
const { uploadToImageKit } = require("../services/imagekitService");

const defaultPaymentSettings = {
  key: "payment",
  upiId: "example@upi",
  qrCodeUrl: "/placeholders/qr-placeholder.svg"
};

const ensurePaymentSettings = async () => {
  let settings = await Setting.findOne({ key: "payment" });

  if (!settings) {
    settings = await Setting.create(defaultPaymentSettings);
  }

  return settings;
};

const getPaymentSettings = asyncHandler(async (req, res) => {
  const settings = await ensurePaymentSettings();
  res.json(settings);
});

const updatePaymentSettings = asyncHandler(async (req, res) => {
  const settings = await ensurePaymentSettings();

  if (req.body.upiId) {
    settings.upiId = req.body.upiId.trim();
  }

  if (req.file) {
    const uploaded = await uploadToImageKit(req.file, "/qr-codes");
    settings.qrCodeUrl = uploaded.url;
  }

  await settings.save();
  res.json(settings);
});

module.exports = { getPaymentSettings, updatePaymentSettings, ensurePaymentSettings };
