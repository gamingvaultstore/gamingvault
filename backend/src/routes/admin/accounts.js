const express = require("express");
const {
  createAccount,
  deleteAccount,
  getAdminAccounts,
  updateAccount
} = require("../../controllers/adminAccountController");
const upload = require("../../middleware/upload");

const router = express.Router();

router.get("/", getAdminAccounts);
router.post("/", upload.array("images", 5), createAccount);
router.put("/:id", upload.array("images", 5), updateAccount);
router.delete("/:id", deleteAccount);

module.exports = router;
