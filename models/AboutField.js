const mongoose = require("mongoose");
const shortid = require("shortid");

const AboutFieldSchema = mongoose.Schema({
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
  index: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("AboutField", AboutFieldSchema);
