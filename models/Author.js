const mongoose = require("mongoose")

const AuthorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

AuthorSchema.pre("remove", async function (next) {
  await this.model("Book").deleteMany({ author: this._id })
  await this.model("Note").deleteMany({ author: this._id })
  next()
})

AuthorSchema.virtual("notes", {
  ref: "Note",
  localField: "_id",
  foreignField: "author",
  justOne: false,
})

AuthorSchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "author",
  justOne: false,
})

module.exports = mongoose.model("Author", AuthorSchema)
