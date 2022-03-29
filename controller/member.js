const Member = require("../models/Member")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc      Get all members
// @route     GET /api/v1/members
// @access    Public
exports.getMembers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult)
})

// @desc      Get single event
// @route     GET /api/v1/members/:id
// @access    Public
exports.getMember = asyncHandler(async (req, res, next) => {
  const member = await Member.findById(req.params.id)

  if (!member) {
    return next(
      new ErrorResponse(
        `There is not any member with id of ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({
    success: true,
    data: member,
  })
})

// @desc      create an member
// @route     POST /api/v1/members/
// @access    Private / admin
exports.createMember = asyncHandler(async (req, res, next) => {
  const member = await Member.create(req.body)

  res.status(200).json({
    success: true,
    data: member,
  })
})

// @desc      Delete member
// @route     DELETE /api/v1/members/:id
// @access    Public
exports.deleteMember = asyncHandler(async (req, res, next) => {
  const member = await Member.findById(req.params.id)

  if (!member) {
    return next(
      new ErrorResponse(
        `There is not any member with id of ${req.params.id}`,
        404
      )
    )
  }

  member.remove()

  res.status(200).json({
    success: true,
    data: member,
  })
})

// @desc      update member
// @route     PUT /api/v1/members/:id
// @access    Public
exports.updateMember = asyncHandler(async (req, res, next) => {
  let member = await Member.findById(req.params.id)

  if (!member) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }

  member = await Member.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: member,
  })
})
