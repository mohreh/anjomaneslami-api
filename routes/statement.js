const express = require("express");
const {
  getAllStatements,
  getStatement,
  createStatement,
  updateStatement,
  deleteStatement,
} = require("../controller/statement");

const router = express.Router();

const Statement = require("../models/Statement");
const advancedResult = require("../middleware/advancedResult");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(advancedResult(Statement), getAllStatements)
  .post(protect, authorize("admin"), createStatement);

router
  .route("/:id")
  .get(getStatement)
  .put(protect, authorize("admin"), updateStatement)
  .delete(protect, authorize("admin"), deleteStatement);

module.exports = router;
