const Event = require("../models/Event");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const imagekit = require("../utils/imagekit");

// @desc      Get all events
// @route     GET /api/v1/events
// @access    Public
exports.getEvents = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult);
});

// @desc      Get single event
// @route     GET /api/v1/events/:id
// @access    Public
exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(
        `There is not any event with id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: event,
  });
});

// @desc      create an event
// @route     POST /api/v1/events/
// @access    Private / admin
exports.createEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.create(req.body);

  res.status(200).json({
    success: true,
    data: event,
  });
});

// @desc      Delete event
// @route     DELETE /api/v1/events/:id
// @access    Public
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  console.log(event);

  if (!event) {
    return next(
      new ErrorResponse(
        `There is not any event with id of ${req.params.id}`,
        404
      )
    );
  }

  if (event.titleImage) {
    await imagekit.deleteFile(event.titleImage.fileId, (error, result) => {
      if (error) return next(new ErrorResponse(`Can't remove image`, 500));
    });
  }

  event.remove();

  res.status(200).json({
    success: true,
    data: event,
  });
});

// @desc      update event
// @route     PUT /api/v1/events/:id
// @access    Public
exports.updateEvent = asyncHandler(async (req, res, next) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: event,
  });
});

// @desc      upload photo for event
// @route     PUT /api/v1/events/:id/photo
// @access    Public
exports.uploadPhoto = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // make sure the file is photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload a image file`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${event._id}${path.parse(file.name).ext}`;

  await imagekit.upload(
    {
      file: file.data.toString("base64"), //required
      fileName: file.name, //required
      folder: `/events/${event.slug}/`,
    },
    async function (error, result) {
      if (error) {
        return next(new ErrorResponse(`Can't upload image`, 500));
      } else {
        await Event.findByIdAndUpdate(req.params.id, {
          titleImage: {
            ...result,
          },
        });

        res.status(200).json({
          success: true,
          data: result,
        });
      }
    }
  );
});
