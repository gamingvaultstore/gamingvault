const Account = require("../models/Account");
const asyncHandler = require("../utils/asyncHandler");
const parseJsonField = require("../utils/parseJson");
const { uploadToImageKit } = require("../services/imagekitService");
const { gameFromParam, sortFromQuery } = require("./accountController");

const toBoolean = (value) =>
  value === true || value === "true" || value === "on";

const accountPayloadFromBody = (body) => ({
  game: gameFromParam(body.game),
  title: body.title,
  description: body.description,
  price: Number(body.price),
  level: body.level,
  specifications: parseJsonField(body.specifications, {}),
  status: body.status || "AVAILABLE",
  featured: toBoolean(body.featured),
});

const uploadedVideo = async (files = {}) => {
  const video = files.video?.[0];
  if (!video) return null;
  const upload = await uploadToImageKit(video, "/account-videos");
  return upload.url;
};

const validateAccountPayload = (payload) => {
  if (!["BGMI", "FREE_FIRE"].includes(payload.game)) return "Game is required";
  if (!payload.title) return "Title is required";
  if (!payload.description) return "Description is required";
  if (!Number.isFinite(payload.price)) return "Valid price is required";
  if (!payload.level) return "Level is required";
  if (!["AVAILABLE", "SOLD", "HIDDEN"].includes(payload.status)) {
    return "Valid status is required";
  }
  return null;
};

const uploadedImageUrls = async (files = []) => {
  const uploads = await Promise.all(
    files.map((file) => uploadToImageKit(file, "/account-images")),
  );
  return uploads.map((upload) => upload.url);
};

const getAdminAccounts = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.game) filter.game = gameFromParam(req.query.game);
  if (req.query.status) filter.status = req.query.status;

  const accounts = await Account.find(filter).sort(
    sortFromQuery(req.query.sort),
  );
  res.json(accounts);
});

const createAccount = asyncHandler(async (req, res) => {
  const payload = accountPayloadFromBody(req.body);
  const validationError = validateAccountPayload(payload);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const images = await uploadedImageUrls(req.files?.images);
  const videoUrl = await uploadedVideo(req.files);
  const account = await Account.create({
    ...payload,
    images: images.length ? images : ["/placeholders/account-default.svg"],
    ...(videoUrl ? { videoUrl } : {}),
  });

  res.status(201).json(account);
});

const updateAccount = asyncHandler(async (req, res) => {
  const account = await Account.findById(req.params.id);

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  const payload = accountPayloadFromBody({
    game: req.body.game ?? account.game,
    title: req.body.title ?? account.title,
    description: req.body.description ?? account.description,
    price: req.body.price ?? account.price,
    level: req.body.level ?? account.level,
    specifications: req.body.specifications ?? account.specifications,
    status: req.body.status ?? account.status,
    featured: req.body.featured ?? account.featured,
  });

  const validationError = validateAccountPayload(payload);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const existingImages = parseJsonField(
    req.body.existingImages,
    account.images,
  );
  const newImages = await uploadedImageUrls(req.files?.images);
  const newVideoUrl = await uploadedVideo(req.files);
  const videoUrl =
    newVideoUrl || (toBoolean(req.body.removeVideo) ? null : account.videoUrl);

  Object.assign(account, payload, {
    images: [...existingImages, ...newImages],
    videoUrl,
  });

  await account.save();
  res.json(account);
});

const deleteAccount = asyncHandler(async (req, res) => {
  const account = await Account.findByIdAndDelete(req.params.id);

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  res.json({ message: "Account deleted" });
});

module.exports = {
  getAdminAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
};
