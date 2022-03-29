const mongoose = require("mongoose")

const ElectionSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
  },
  for: {
    type: String,
    required: true,
  },
  candidate: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      member: {
        type: mongoose.Schema.ObjectId,
        ref: "Member",
        required: true,
      },
      author: {
        type: mongoose.Schema.ObjectId,
        ref: "Author",
      },
      voteCount: {
        type: Number,
        default: 1,
        select: false,
      },
    },
  ],
  deleteQuery: {
    type: String,
    default: "deleteQuery",
    select: false,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
})

// Matched user entered password to hashed password in database
ElectionSchema.methods.matchDeleteQueries = async function (enteredPassword) {
  return enteredPassword === this.deleteQuery
}

module.exports = mongoose.model("Election", ElectionSchema)
