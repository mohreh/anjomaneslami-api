const Author = require("../models/Author")
const User = require("../models/User")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc      Get single author
// @route     GET /api/v1/author/:id
// @access    Public
exports.getAuthor = asyncHandler(async (req, res, next) => {
  const author = await Author.findById(req.params.id).populate([
    {
      path: "notes",
      select: "title description",
    },
    {
      path: "books",
      select: "title titleImage writer createdAt",
    },
    {
      path: "user",
      select: "name email",
    },
  ])

  res.status(200).json({
    success: true,
    data: author,
  })
})

// @desc      Create author
// @route     POST /api/v1/author
// @access    Private/admin
exports.createAuthor = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  if (!req.body.user) {
    return next(new ErrorResponse(`Please add user id to body`, 400))
  }

  // Check for published bootcamp
  const usersAuthor = await Author.findOne({ user: req.body.user })

  // If the user is not admin, they can only add one bootcamp
  if (usersAuthor) {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} has already have a author`,
        400
      )
    )
  }

  const author = await Author.create(req.body)
  await User.findByIdAndUpdate(req.body.user, { author: author._id })

  res.status(200).json({
    success: true,
    data: author,
  })
})

// @desc      update author
// @route     PUT /api/v1/author/:id
// @access    Private/admin
exports.updateAuthor = asyncHandler(async (req, res, next) => {
  let author = await Author.findById(req.params.id)

  if (!author) {
    return next(
      new ErrorResponse(`Author not found with id of ${req.params.id}`, 404)
    )
  }

  author = await Author.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: author,
  })
})

// @desc      Delete author
// @route     DELETE /api/v1/author/:id
// @access    Private/admin
exports.deleteAuthor = asyncHandler(async (req, res, next) => {
  const author = await Author.findById(req.params.id)

  if (!author) {
    return next(
      new ErrorResponse(`Author not found with id of ${req.params.id}`, 404)
    )
  }

  await author.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})
