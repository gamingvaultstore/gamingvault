const FAQ = require("../models/FAQ");
const asyncHandler = require("../utils/asyncHandler");

const toBoolean = (value) => value === true || value === "true" || value === "on";

const getFaqs = asyncHandler(async (req, res) => {
  const faqs = await FAQ.find({ active: true }).sort({ order: 1, createdAt: -1 });
  res.json(faqs);
});

const getAdminFaqs = asyncHandler(async (req, res) => {
  const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });
  res.json(faqs);
});

const createFaq = asyncHandler(async (req, res) => {
  const { question, answer, order, active } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ message: "Question and answer are required" });
  }

  const faq = await FAQ.create({
    question,
    answer,
    order: Number(order || 0),
    active: active === undefined ? true : toBoolean(active)
  });

  res.status(201).json(faq);
});

const updateFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);

  if (!faq) {
    return res.status(404).json({ message: "FAQ not found" });
  }

  ["question", "answer"].forEach((field) => {
    if (req.body[field] !== undefined) faq[field] = req.body[field];
  });

  if (req.body.order !== undefined) faq.order = Number(req.body.order);
  if (req.body.active !== undefined) faq.active = toBoolean(req.body.active);

  await faq.save();
  res.json(faq);
});

const deleteFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByIdAndDelete(req.params.id);

  if (!faq) {
    return res.status(404).json({ message: "FAQ not found" });
  }

  res.json({ message: "FAQ deleted" });
});

module.exports = { getFaqs, getAdminFaqs, createFaq, updateFaq, deleteFaq };
