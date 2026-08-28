const express = require("express");
const {
  createCustomerProof,
  deleteCustomerProof,
  getAdminCustomerProofs
} = require("../../controllers/customerProofController");
const upload = require("../../middleware/upload");

const router = express.Router();

router.get("/", getAdminCustomerProofs);
router.post("/", upload.single("image"), createCustomerProof);
router.delete("/:id", deleteCustomerProof);

module.exports = router;
