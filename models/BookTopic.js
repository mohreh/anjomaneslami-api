const ErrorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");

const BookTopicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
    color: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

BookTopicSchema.pre("save", async function (next) {
  if (this.name.includes(" ")) {
    return next(new ErrorResponse("BookTopic must defined without space", 400));
  }

  if (!this.name.startsWith("#")) {
    this.name = "#" + this.name;
  }

  if (!this.slug) {
    this.slug = this.name.replace("#", "");
  }

  next();
});

BookTopicSchema.pre("findOneAndUpdate", async function (next) {
  if (!this._update.name) {
    next();
  }

  if (this._update.name.includes(" ")) {
    return next(new ErrorResponse("BookTopic must defined without space", 400));
  }

  if (!this._update.name.startsWith("#")) {
    this._update.name = "#" + this._update.name;
  }

  this._update.slug = this._update.name;

  next();
});

BookTopicSchema.pre("remove", async function (next) {
  await this.model("Book").findOneAndUpdate(
    {
      mainTopic: this._id,
    },
    {
      $pull: { mainTopic: this._id },
    },
    {
      runValidators: true,
    }
  );

  next();
});

BookTopicSchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "mainTopic",
  justOne: false,
});

module.exports = mongoose.model("BookTopic", BookTopicSchema);
