const express = require("express")

const {
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controller/author")

const router = express.Router()

const { protect, authorize } = require("../middleware/auth")

router.route("/").post(protect, authorize("admin"), createAuthor)

router
  .route("/:id")
  .get(getAuthor)
  .delete(protect, authorize("admin"), deleteAuthor)
  .put(protect, authorize("admin"), updateAuthor)

module.exports = router
