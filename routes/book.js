const express = require("express")
const {
  getAllBooks,
  getBookWithSingleReview,
  updateBook,
  updateReviewInBook,
  createBook,
  deleteBook,
  addReviewToBook,
  removeReviewFromBook,
  getBookWithAllReview,
} = require("../controller/book")

const router = express.Router()

const Book = require("../models/Book")

const advancedResult = require("../middleware/advancedResult")
const { protect, authorize } = require("../middleware/auth")

router
  .route("/")
  .get(
    advancedResult(Book, [{ path: "author" }, { path: "hashtags" }]),
    getAllBooks
  )
  .post(protect, authorize("member", "admin"), createBook)

router
  .route("/:id")
  .get(getBookWithAllReview)
  .post(protect, authorize("member", "admin"), addReviewToBook)
  .put(protect, authorize("member", "admin"), updateBook)
  .delete(protect, authorize("member", "admin"), deleteBook)

router
  .route("/:id/:indexId")
  .get(getBookWithSingleReview)
  .delete(protect, authorize("member", "admin"), removeReviewFromBook)
  .put(protect, authorize("member", "admin"), updateReviewInBook)

module.exports = router
