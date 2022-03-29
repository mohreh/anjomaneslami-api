const Hashtag = require("../models/Hashtag")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc      Get single Hashtag
// @route     GET /api/v1/hashtag/:id
// @access    Public
exports.getHashtag = asyncHandler(async (req, res, next) => {
  const hashtag = await Hashtag.findById(req.params.id).populate([
    {
      path: "notes",
      select: "title description",
    },
    {
      path: "books",
      select: "name bookImage writer createdAt",
    },
  ])

  res.status(200).json({
    success: true,
    data: hashtag,
  })
})

// @desc      Create hashtag
// @route     POST /api/v1/hashtag
// @access    Private/admin
exports.createHashtag = asyncHandler(async (req, res, next) => {
  console.log(req.body)
  const hashtag = await Hashtag.create(req.body)

  res.status(200).json({
    success: true,
    data: hashtag,
  })
})

// @desc      update hashtag
// @route     PUT /api/v1/hashtag/:id
// @access    Private/admin
exports.updateHashtag = asyncHandler(async (req, res, next) => {
  let hashtag = await Hashtag.findById(req.params.id)

  if (!hashtag) {
    return next(
      new ErrorResponse(`Hashtag not found with id of ${req.params.id}`, 404)
    )
  }

  hashtag = await Hashtag.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: hashtag,
  })
})

// @desc      Delete hashtag
// @route     DELETE /api/v1/hashtag/:id
// @access    Private/admin
exports.deleteHashtag = asyncHandler(async (req, res, next) => {
  const hashtag = await Hashtag.findById(req.params.id)

  if (!hashtag) {
    return next(
      new ErrorResponse(`Hashtag not found with id of ${req.params.id}`, 404)
    )
  }

  await hashtag.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})
