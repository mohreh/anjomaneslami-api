const express = require("express")
const {
  getMembers,
  getMember,
  createMember,
  deleteMember,
  updateMember,
} = require("../controller/member")

const router = express.Router({ mergeParams: true })

const Member = require("../models/Member")

const advancedResult = require("../middleware/advancedResult")
const { protect, authorize } = require("../middleware/auth")

router.use(protect)
router.use(authorize("admin"))

router
  .route("/")
  .get(advancedResult(Member, { path: "userAccount" }), getMembers)
  .post(createMember)

router.route("/:id").get(getMember).put(deleteMember).delete(updateMember)

module.exports = router
