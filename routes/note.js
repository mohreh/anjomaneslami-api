const express = require("express")
const {
  getAllNotes,
  getNote,
  createNote,
  deleteNote,
  updateNote,
  uploadImage,
} = require("../controller/note")

const router = express.Router()

const Note = require("../models/Note")
const advancedResult = require("../middleware/advancedResult")
const { protect, authorize } = require("../middleware/auth")

router
  .route("/")
  .get(
    advancedResult(Note, [
      {
        path: "author",
      },
      {
        path: "hashtags",
      },
    ]),
    getAllNotes
  )
  .post(protect, authorize("member", "admin"), createNote)

router
  .route("/:id")
  .get(getNote)
  .put(protect, authorize("member", "admin"), updateNote)
  .delete(protect, authorize("member", "admin"), deleteNote)

router
  .route("/:id/photo")
  .put(protect, authorize("member", "admin"), uploadImage)

module.exports = router
