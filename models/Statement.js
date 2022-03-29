const mongoose = require("mongoose");
const shortid = require("shortid");

const StatementSchema = mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  body: {
    type: String,
    required: [true, "Please add body"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Statement", StatementSchema);
