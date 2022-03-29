const mongoose = require("mongoose");
const shortid = require("shortid");

const TalkSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  titleImage: String,
  persons: [
    {
      _id: {
        type: String,
        default: shortid.generate,
      },
      name: {
        type: String,
        required: true,
      },
      image: {
        type: Object,
      },
      introduce: {
        type: String,
        required: true,
      },
    },
  ],
  description: {
    type: String,
    required: [true, "Please add a description"],
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

module.exports = mongoose.model("Talk", TalkSchema);
