const express = require("express")
const {
  getEvents,
  getEvent,
  createEvent,
  deleteEvent,
  updateEvent,
  uploadPhoto,
} = require("../controller/event")

const router = express.Router()

const Event = require("../models/Event")
const advancedResult = require("../middleware/advancedResult")
const { protect, authorize } = require("../middleware/auth")

router
  .route("/")
  .get(advancedResult(Event), getEvents)
  .post(protect, authorize("admin"), createEvent)

router
  .route("/:id")
  .get(getEvent)
  .put(protect, authorize("admin"), updateEvent)
  .delete(protect, authorize("admin"), deleteEvent)

router.route("/:id/photo").put(protect, authorize("admin"), uploadPhoto)

module.exports = router
