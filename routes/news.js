const express = require("express")
const {
  getAllNews,
  getSingleNews,
  addNews,
  updateNews,
  deleteNews,
  uploadImage,
} = require("../controller/news")

const router = express.Router()

const News = require("../models/News")
const advancedResult = require("../middleware/advancedResult")
const { protect, authorize } = require("../middleware/auth")

router
  .route("/")
  .get(advancedResult(News), getAllNews)
  .post(protect, authorize("admin"), addNews)

router
  .route("/:id")
  .get(getSingleNews)
  .put(protect, authorize("admin"), updateNews)
  .delete(protect, authorize("admin"), deleteNews)

router.route("/:id/photo").put(protect, authorize("admin"), uploadImage)

module.exports = router
