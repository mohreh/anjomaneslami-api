const express = require("express")

const {
  register,
  login,
  getMe,
  forgotPassword,
  ressetPassword,
  updateDetails,
  updatePassword,
  logout,
} = require("../controller/auth")

const router = express.Router()

const { protect } = require("../middleware/auth")

router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout)
router.get("/me", protect, getMe)
router.put("/updatedetails", protect, updateDetails)
router.post("/forgotpassword", forgotPassword)
router.put("/updatepassword", protect, updatePassword)
router.put("/resetpassword/:resetToken", ressetPassword)

module.exports = router
