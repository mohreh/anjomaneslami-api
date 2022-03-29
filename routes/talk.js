const express = require("express")
const {
  getTalks,
  getTalk,
  deleteTalk,
  createTalk,
  uploadImageForPersons,
  updateTalk,
} = require("../controller/talk")

const router = express.Router()

const Talk = require("../models/Talk")
const advancedResult = require("../middleware/advancedResult")
const { protect, authorize } = require("../middleware/auth")

router
  .route("/")
  .get(advancedResult(Talk), getTalks)
  .post(protect, authorize("admin"), createTalk)

router
  .route("/:id")
  .get(getTalk)
  .delete(protect, authorize("admin"), deleteTalk)
  .put(protect, authorize("admin"), updateTalk)

router
  .route("/:id/photo")
  .put(protect, authorize("admin"), uploadImageForPersons)

module.exports = router
