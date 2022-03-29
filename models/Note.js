const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  description: {
    type: String,
  },
  titleImage: {
    type: Object,
  },
  body: {
    type: String,
    required: true,
  },

  author: {
    type: mongoose.Schema.ObjectId,
    ref: "Author",

    required: [true, "Please add a author"],
  },
  hashtags: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Hashtag",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Note", NoteSchema);
