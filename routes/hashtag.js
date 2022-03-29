const express = require("express")
const {
  getHashtag,
  createHashtag,
  updateHashtag,
  deleteHashtag,
} = require("../controller/hashtag")

const router = express.Router()

const { protect, authorize } = require("../middleware/auth")

router.route("/").post(protect, authorize("member", "admin"), createHashtag)

router
  .route("/:id")
  .get(getHashtag)
  .delete(protect, authorize("admin"), deleteHashtag)
  .put(protect, authorize("admin"), updateHashtag)

module.exports = router
