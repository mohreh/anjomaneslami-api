const Talk = require("../models/Talk")
const path = require("path")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
const imagekit = require("../utils/imagekit")

// @desc      Get all talks
// @route     GET /api/v1/talks
// @access    Public
exports.getTalks = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult)
})

// @desc      Get single talk
// @route     GET /api/v1/talks/:id
// @access    Private
exports.getTalk = asyncHandler(async (req, res, next) => {
  const talk = await Talk.findById(req.params.id)

  if (!talk) {
    return next(
      new ErrorResponse(`Talk not found with id of ${req.params.id}`, 404)
    )
  }

  res.status(201).json({
    success: true,
    data: talk,
  })
})

// @desc      Update talk
// @route     PUT /api/v1/talks/:id
// @access    Private
exports.updateTalk = asyncHandler(async (req, res, next) => {
  let talk = await Talk.findById(req.params.id)

  if (!talk) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }

  talk = await Talk.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(201).json({
    success: true,
    data: talk,
  })
})

// @desc      delete talk
// @route     DELETE /api/v1/talks/:id
// @access    Private
exports.deleteTalk = asyncHandler(async (req, res, next) => {
  const talk = await Talk.findById(req.params.id)

  if (!talk) {
    new ErrorResponse(`Talk not found with id of ${req.params.id}`, 404)
  }

  talk.persons.forEach(async (person) => {
    await imagekit.deleteFile(person.image.fileId, (error, result) => {
      if (error) return next(new ErrorResponse(`Can't remove image`, 500))
    })
  })

  talk.remove()

  res.status(201).json({
    success: true,
    data: {},
  })
})

// @desc      create talk
// @route     POST /api/v1/talks
// @access    Private
exports.createTalk = asyncHandler(async (req, res, next) => {
  const talk = await Talk.create(req.body)

  res.status(201).json({
    success: true,
    data: talk,
  })
})

// @desc      Upload images for persons
// @route     POST /api/v1/talks
// @access    Private
exports.uploadImageForPersons = asyncHandler(async (req, res, next) => {
  let talk = await Talk.findById(req.params.id)

  if (!talk) {
    return next(
      new ErrorResponse(
        `There is not any talks with id of ${req.params.id}`,
        404
      )
    )
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400))
  }

  const index = req.body.index

  if (index == talk.persons.length) {
    return next(new ErrorResponse("index out of range", 400))
  }

  const file = req.files.file

  // make sure the file is photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload a image file`, 400))
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    )
  }

  // Create custom filename
  file.name = `photo_${talk._id}${path.parse(file.name).ext}`

  await imagekit.upload(
    {
      file: file.data.toString("base64"), //required
      fileName: file.name, //required
      // useUniqueFileName: true,
      folder: `/talks/${talk.slug}/`,
      // isPrivateFile: false,
    },
    async function (error, result) {
      if (error) {
        return next(new ErrorResponse(`Can't upload image`, 500))
      } else {
        talk = await Talk.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              "persons.$[el].image": {
                fileId: result.fileId,
                url: result.url,
                fileType: result.fileType,
                thumbnailUrl: result.thumbnailUrl,
              },
            },
          },
          {
            arrayFilters: [{ "el._id": talk.persons[index]._id }],
            new: true,
          }
        )

        res.status(200).json({
          success: true,
          data: talk,
        })
      }
    }
  )
})
