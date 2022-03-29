const mongoose = require("mongoose");
const shortid = require("shortid");

const NewsSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  titleImage: {
    type: Object,
  },
  body: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("News", NewsSchema);
