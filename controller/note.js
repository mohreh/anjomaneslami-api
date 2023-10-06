const Note = require("../models/Note");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const imagekit = require("../utils/imagekit");

// @desc      Get all notes
// @route     GET /api/v1/notes
// @access    Public
exports.getAllNotes = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult);
});

// @desc      Get single notes
// @route     GET /api/v1/notes/:id
// @access    Public
exports.getNote = asyncHandler(async (req, res, next) => {
  if (!req.cookies.views) {
    res.cookie("views", req.params.id + ",", {
      expiresIn: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 30 * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
    });

    await Note.findByIdAndUpdate(req.params.id, { $inc: { viewsCount: 1 } });
  } else {
    if (!req.cookies.views.includes(req.params.id)) {
      res.cookie("views", req.cookies.views + req.params.id + ",", {
        expiresIn: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 30 * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
      });

      await Note.findByIdAndUpdate(req.params.id, { $inc: { viewsCount: 1 } });
    }
  }

  const note = await Note.findById(req.params.id).populate([
    {
      path: "author",
    },
    {
      path: "hashtags.",
    },
  ]);

  if (!note) {
    return next(new ErrorResponse(`Note with id of ${req.paramsid}`, 404));
  }

  res.status(200).json({
    success: true,
    data: note,
  });
});

// @desc      Create notes
// @route     POST /api/v1/notes
// @access    Private
exports.createNote = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    req.body.author = req.user.author;
  }

  const note = await Note.create(req.body);

  res.status(201).json({
    success: true,
    date: note,
  });
});

// @desc      Delete notes
// @route     POST /api/v1/notes/:id
// @access    Private
exports.updateNote = asyncHandler(async (req, res, next) => {
  let note = await Note.findById(req.params.id);

  if (!note) {
    return next(new ErrorResponse(`Note with id of ${req.paramsid}`, 404));
  }

  if (req.user.role !== "admin") {
    req.body.author = req.user.author;
  }

  note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    date: note,
  });
});

// @desc      Delete notes
// @route     POST /api/v1/notes/:id
// @access    Private
exports.deleteNote = asyncHandler(async (req, res, next) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return next(new ErrorResponse(`Note with id of ${req.paramsid}`, 404));
  }

  await note.remove();

  res.status(201).json({
    success: true,
    date: {},
  });
});

exports.uploadImage = asyncHandler(async (req, res, next) => {
  const note = await Note.findById(req.params.id);
  console.log(note._id);

  if (!note) {
    return next(
      new ErrorResponse(
        `There is not any note with id of ${req.params.id}`,
        404,
      ),
    );
  }

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
        400,
      ),
    );
  }

  // Create custom filename
  file.name = `photo_${note._id}${path.parse(file.name).ext}`;

  await imagekit.upload(
    {
      file: file.data.toString("base64"), //required
      fileName: file.name, //required
      // useUniqueFileName: true,
      folder: `/notes/${note.slug}/`,
      // isPrivateFile: false,
    },
    async function (error, result) {
      if (error) {
        return next(new ErrorResponse(`Can't upload image`, 500));
      } else {
        await Note.findByIdAndUpdate(req.params.id, {
          titleImage: {
            fileId: result.fileId,
            url: result.url,
            fileType: result.fileType,
            thumbnailUrl: result.thumbnailUrl,
          },
        });

        res.status(200).json({
          success: true,
          data: result,
        });
      }
    },
  );
});
