const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a title"],
  },
  bookImage: {
    type: Object,
    default: {
      url: "no-photo.jpg",
    },
  },
  writer: {
    type: String,
    required: [true, "Please add a writer name"],
  },
  mainTopic: {
    type: mongoose.Schema.ObjectId,
    ref: "BookTopic",
    required: [true, "Please add main topic of this book"],
  },
  publisher: {
    type: String,
    required: [true, "Please add main topic of this book"],
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
  translator: String,
  description: String,
  moreInformation: String,
  viewsCount: {
    type: Number,
    default: 0,
  },
  content: [
    {
      body: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

module.exports = mongoose.model("Book", BookSchema);
