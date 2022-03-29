const Statement = require("../models/Statement")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc      Get all statement
// @route     GET /api/v1/statement
// @access    Public
exports.getAllStatements = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult)
})

// @desc      Get single statement
// @route     GET /api/v1/statement/:id
// @access    Public
exports.getStatement = asyncHandler(async (req, res, next) => {
  const statement = await Statement.findById(req.params.id)

  if (!statement) {
    return next(
      new ErrorResponse(`Statement not found with id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    data: statement,
  })
})

// @desc      Create statement
// @route     POST /api/v1/statement
// @access    Private/admin
exports.createStatement = asyncHandler(async (req, res, next) => {
  const statement = await Statement.create(req.body)

  res.status(200).json({
    success: true,
    data: statement,
  })
})

// @desc      update statement
// @route     PUT /api/v1/statement/:id
// @access    Private/admin
exports.updateStatement = asyncHandler(async (req, res, next) => {
  let statement = await Statement.findById(req.params.id)

  if (!statement) {
    return next(
      new ErrorResponse(`Statement not found with id of ${req.params.id}`, 404)
    )
  }

  statement = await Statement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: statement,
  })
})

// @desc      Delete statement
// @route     DELETE /api/v1/statement/:id
// @access    Private/admin
exports.deleteStatement = asyncHandler(async (req, res, next) => {
  const statement = await Statement.findById(req.params.id)

  if (!statement) {
    return next(
      new ErrorResponse(`Statement not found with id of ${req.params.id}`, 404)
    )
  }

  await statement.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})
