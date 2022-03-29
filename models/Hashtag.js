const ErrorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");

const HashtagSchema = new mongoose.Schema(
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

HashtagSchema.pre("save", async function (next) {
  if (this.name.includes(" ")) {
    return next(new ErrorResponse("Hashtags must defined without space", 400));
  }

  if (!this.name.startsWith("#")) {
    this.name = "#" + this.name;
  }

  if (!this.slug) {
    this.slug = this.name.replace("#", "");
  }

  next();
});

HashtagSchema.pre("findOneAndUpdate", async function (next) {
  if (!this._update.name) {
    next();
  }

  if (this._update.name.includes(" ")) {
    return next(new ErrorResponse("Hashtags must defined without space", 400));
  }

  if (!this._update.name.startsWith("#")) {
    this._update.name = "#" + this._update.name;
  }

  this._update.slug = this._update.name;

  next();
});

HashtagSchema.pre("remove", async function (next) {
  await this.model("Book").findOneAndUpdate(
    {
      hashtags: this._id,
    },
    {
      $pull: { hashtags: this._id },
    },
    {
      runValidators: true,
    }
  );

  await this.model("Note").findOneAndUpdate(
    {
      hashtags: this._id,
    },
    {
      $pull: { hashtags: this._id },
    },
    {
      runValidators: true,
    }
  );

  next();
});

HashtagSchema.virtual("notes", {
  ref: "Note",
  localField: "_id",
  foreignField: "hashtags",
  justOne: false,
});

HashtagSchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "hashtags",
  justOne: false,
});

module.exports = mongoose.model("Hashtag", HashtagSchema);
