const express = require("express");
const { getCustomerProofs } = require("../controllers/customerProofController");

const router = express.Router();

router.get("/", getCustomerProofs);

module.exports = router;
