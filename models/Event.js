const mongoose = require("mongoose");
const shortid = require("shortid");

const EventSchema = new mongoose.Schema({
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
  startDate: {
    type: Date,
    required: [true, "Please add start date"],
  },
  status: {
    type: String,
    enum: ["inprograss", "terminated", "canceled"],
    default: "inprograss",
  },
  endDate: {
    type: Date,
    required: [true, "Please add duration time"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Event", EventSchema);
