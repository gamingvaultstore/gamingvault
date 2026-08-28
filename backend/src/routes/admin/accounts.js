const express = require("express");
const {
  createAccount,
  deleteAccount,
  getAdminAccounts,
  updateAccount,
} = require("../../controllers/adminAccountController");
const upload = require("../../middleware/upload");

const router = express.Router();

router.get("/", getAdminAccounts);
router.post(
  "/",
  upload.accountUpload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  createAccount,
);
router.put(
  "/:id",
  upload.accountUpload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  updateAccount,
);
router.delete("/:id", deleteAccount);

module.exports = router;
