const AboutField = require("../models/AboutField");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc      Get all Fields
// @route     GET /api/v1/about
// @access    Public
exports.getAllFields = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult);
});

// @desc      Create filed
// @route     POST /api/v1/avout
// @access    Private/admin
exports.createField = asyncHandler(async (req, res, next) => {
  const field = await AboutField.create(req.body);

  res.status(200).json({
    success: true,
    data: field,
  });
});

// @desc      update field
// @route     PUT /api/v1/about/:id
// @access    Private/admin
exports.updateField = asyncHandler(async (req, res, next) => {
  let field = await AboutField.findById(req.params.id);

  if (!field) {
    return next(
      new ErrorResponse(`field not found with id of ${req.params.id}`, 404)
    );
  }

  field = await AboutField.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: field,
  });
});

// @desc      Delete field
// @route     DELETE /api/v1/about/:id
// @access    Private/admin
exports.deleteField = asyncHandler(async (req, res, next) => {
  const field = await AboutField.findById(req.params.id);

  if (!field) {
    return next(
      new ErrorResponse(`field not found with id of ${req.params.id}`, 404)
    );
  }

  await field.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
