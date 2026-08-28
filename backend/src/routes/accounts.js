const express = require("express");
const {
  getAccount,
  getAccounts
} = require("../controllers/accountController");

const router = express.Router();

router.get("/", getAccounts);
router.get("/:id", getAccount);

module.exports = router;
