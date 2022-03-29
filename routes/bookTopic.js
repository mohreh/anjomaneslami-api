const express = require("express")
const {
  getTopic,
  createTopic,
  updateTopic,
  deleteTopic,
} = require("../controller/bookTopic")

const router = express.Router()

const { protect, authorize } = require("../middleware/auth")

router.route("/").post(protect, authorize("admin"), createTopic)

router
  .route("/:id")
  .get(getTopic)
  .delete(protect, authorize("admin"), deleteTopic)
  .put(protect, authorize("admin"), updateTopic)

module.exports = router
