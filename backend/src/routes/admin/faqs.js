const express = require("express");
const {
  createFaq,
  deleteFaq,
  getAdminFaqs,
  updateFaq
} = require("../../controllers/faqController");

const router = express.Router();

router.get("/", getAdminFaqs);
router.post("/", createFaq);
router.put("/:id", updateFaq);
router.delete("/:id", deleteFaq);

module.exports = router;
