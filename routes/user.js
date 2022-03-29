const express = require("express")

const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} = require("../controller/user")

const User = require("../models/User")

const router = express.Router({ mergeParams: true })

const advancedResult = require("../middleware/advancedResult")
const { protect, authorize } = require("../middleware/auth")

router.use(protect)
router.use(authorize("admin"))

router
  .route("/")
  .get(authorize("admin"), advancedResult(User), getUsers)
  .post(createUser)

router
  .route("/:id")
  .get(authorize("member", "admin"), getUser)
  .put(authorize("member", "admin"), updateUser)
  .delete(authorize("admin"), deleteUser)

module.exports = router
