const mongoose = require("mongoose")

const MemberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please add a firstName"],
  },
  lastName: {
    type: String,
    required: [true, "Please add a lastName"],
  },
  entry: {
    type: String,
  },
  field: {
    type: String,
  },
  grade: {
    type: String,
  },
  number: {
    type: Number,
    required: [true, "Please your number"],
  },
  phoneNumber: {
    type: String,
  },
  userAccount: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  vote: {
    type: Boolean,
    default: false,
  },
  validateForVote: {
    type: Boolean,
    default: false,
  },
  register: {
    type: Boolean,
    default: false,
  },
  validateForRegister: {
    type: Boolean,
    default: false,
  },
})

module.exports = mongoose.model("Member", MemberSchema)
