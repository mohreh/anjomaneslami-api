const Election = require("../models/Election")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
const { delete } = require("../routes/news")
const e = require("express")

// @desc      Get all elections
// @route     GET /api/v1/elections
// @access    private
exports.getAllElections = asyncHandler(async (req, res, next) => {
  const elections = await Election.find().populate([
    { path: "candidate.member" },
    { path: "candidate.author" },
  ])

  res.status(200).json({
    success: true,
    date: elections,
  })
})

// @desc      Get single election
// @route     GET /api/v1/elections/:id
// @access    private
exports.getElection = asyncHandler(async (req, res, next) => {
  const election = await Election.findById(req.params.id).populate([
    { path: "candidate.member" },
    { path: "candidate.author" },
  ])

  res.status(200).json({
    success: true,
    date: election,
  })
})

// @desc      Create election
// @route     GET /api/v1/elections/
// @access    private
exports.createElection = asyncHandler(async (req, res, next) => {
  const election = await Election.create(req.body)

  res.status(200).json({
    success: true,
    date: election,
  })
})

// @desc      update election
// @route     PUT /api/v1/elections/:id
// @access    private
exports.updateElection = asyncHandler(async (req, res, next) => {
  if (req.body.candidate) {
    delete req.body.candidate
  }

  const election = await Election.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    date: election,
  })
})

// @desc      Delete election
// @route     DELETE /api/v1/elections/:id/:deleteQuery
// @access    private
exports.deleteElection = asyncHandler(async (req, res, next) => {
  const election = await Election.findById(req.params.id)

  if (election.matchDeleteQueries(req.params.deleteQuery)) {
    await election.remove()
  }

  res.status(200).json({
    success: true,
    date: {},
  })
})

// @desc      Delete election
// @route     DELETE /api/v1/elections/:id/:deleteQuery
// @access    private
exports.deleteElection = asyncHandler(async (req, res, next) => {
  const election = await Election.findById(req.params.id)

  if (election.matchDeleteQueries(req.params.deleteQuery)) {
    await election.remove()
  }

  res.status(200).json({
    success: true,
    date: {},
  })
})

// @desc      add candidate
// @route     POST /api/v1/elections/:id
// @access    private
exports.addCandidate = asyncHandler(async (req, res, next) => {
  let election = await Election.findById(req.params.id)

  if (!election) {
    return next(
      new ErrorResponse(`Book not fount with id of ${req.params.id}`, 400)
    )
  }

  election = await Election.findByIdAndUpdate(
    req.params.id,
    {
      $push: { candidate: req.body },
    },
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).json({
    success: true,
    date: election,
  })
})

// @desc      delete candidate
// @route     DELETE /api/v1/elections/:id/:candidateId
// @access    private
exports.deleteCandidate = asyncHandler(async (req, res, next) => {
  let election = await Election.findById(req.params.id)

  if (!election) {
    return next(
      new ErrorResponse(`Book not fount with id of ${req.params.id}`, 400)
    )
  }

  const candidate = await Election.findById(req.params.id).select({
    candidate: { $elemMatch: { _id: req.params.candidateId } },
  })

  if (!candidate.candidate.length) {
    return next(new ErrorResponse("Content not Founded", 404))
  }

  election = await Election.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { candidate: { _id: req.params.candidateId } },
    },
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).json({
    success: true,
    date: election,
  })
})

// @desc      update candidate
// @route     PUT /api/v1/elections/:id/:candidateId
// @access    private
exports.updateCandidate = asyncHandler(async (req, res, next) => {
  let election = await Election.findById(req.params.id)

  if (!election) {
    return next(
      new ErrorResponse(`Book not fount with id of ${req.params.id}`, 400)
    )
  }

  const candidate = await Election.findById(req.params.id).select({
    candidate: { $elemMatch: { _id: req.params.candidateId } },
  })

  if (!candidate.candidate.length) {
    return next(new ErrorResponse("Content not Founded", 404))
  }

  req.body._id = req.params.candidateId

  book = await Book.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        "content.$[el]": req.body,
      },
    },
    {
      arrayFilters: [{ "el._id": req.params.candidateId }],
      new: true,
      runValidators: true,
    }
  )

  res.status(200).json({
    success: true,
    date: election,
  })
})

// @desc      vote candidate
// @route     PUT /api/v1/elections/:id/:candidateId
// @access    private
exports.vote = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    date: {},
  })
})
