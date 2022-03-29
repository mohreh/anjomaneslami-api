const BookTopic = require("../models/BookTopic")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc      Get single Hashtag
// @route     GET /api/v1/hashtag/:id
// @access    Public
exports.getTopic = asyncHandler(async (req, res, next) => {
  const topic = await BookTopic.findById(req.params.id).populate({
    path: "books",
    select: "name bookImage writer createdAt",
  })

  res.status(200).json({
    success: true,
    data: topic,
  })
})

// @desc      Create hashtag
// @route     POST /api/v1/hashtag
// @access    Private/admin
exports.createTopic = asyncHandler(async (req, res, next) => {
  const topic = await BookTopic.create(req.body)

  res.status(200).json({
    success: true,
    data: topic,
  })
})

// @desc      update hashtag
// @route     PUT /api/v1/hashtag/:id
// @access    Private/admin
exports.updateTopic = asyncHandler(async (req, res, next) => {
  let topic = await BookTopic.findById(req.params.id)

  if (!topic) {
    return next(
      new ErrorResponse(`BookTopic not found with id of ${req.params.id}`, 404)
    )
  }

  topic = await BookTopic.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: topic,
  })
})

// @desc      Delete hashtag
// @route     DELETE /api/v1/hashtag/:id
// @access    Private/admin
exports.deleteTopic = asyncHandler(async (req, res, next) => {
  const topic = await BookTopic.findById(req.params.id)

  if (!topic) {
    return next(
      new ErrorResponse(`BookTopic not found with id of ${req.params.id}`, 404)
    )
  }

  await topic.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})
