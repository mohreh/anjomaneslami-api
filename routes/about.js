const express = require("express");
const {
  getAllFields,
  createField,
  updateField,
  deleteField,
} = require("../controller/about");

const router = express.Router();

const About = require("../models/AboutField");

const advancedResult = require("../middleware/advancedResult");

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(advancedResult(About), getAllFields)
  .post(protect, authorize("admin"), createField);
router
  .route("/:id")
  .put(protect, authorize("admin"), updateField)
  .delete(protect, authorize("admin"), deleteField);

module.exports = router;
