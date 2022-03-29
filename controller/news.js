const News = require("../models/News");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const imagekit = require("../utils/imagekit");

// @desc      Get all news
// @route     GET /api/v1/news
// @access    Public
exports.getAllNews = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult);
});

// @desc      Get single news
// @route     GET /api/v1/news/:id
// @access    Public
exports.getSingleNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return next(
      new ErrorResponse(
        `There is not any news with id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: news,
  });
});

// @desc      Create news
// @route     POST /api/v1/news
// @access    Pritvate/admin
exports.addNews = asyncHandler(async (req, res, next) => {
  const news = await News.create(req.body);

  res.status(200).json({
    success: true,
    data: news,
  });
});

// @desc      Update news
// @route     PUT /api/v1/news/:id
// @access    Pritvate/admin
exports.updateNews = asyncHandler(async (req, res, next) => {
  let news = await News.findById(req.params.id);

  if (!news) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  news = await News.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: news,
  });
});

// @desc      Delete news
// @route     DELETE /api/v1/news/:id
// @access    Private/admin
exports.deleteNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return next(
      new ErrorResponse(
        `There is not any news with id of ${req.params.id}`,
        404
      )
    );
  }

  if (news.titleImage) {
    await imagekit.deleteFile(news.titleImage.fileId, (error, result) => {
      if (error) return next(new ErrorResponse(`Can't remove image`, 500));
    });
  }

  news.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Upload image for news
// @route     PUT /api/v1/news/:id/photo
// @access    Private/admin
exports.uploadImage = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);
  console.log(news._id);

  if (!news) {
    return next(
      new ErrorResponse(
        `There is not any news with id of ${req.params.id}`,
        404
      )
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
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${news._id}${path.parse(file.name).ext}`;

  await imagekit.upload(
    {
      file: file.data.toString("base64"), //required
      fileName: file.name, //required
      // useUniqueFileName: true,
      folder: `/news/${news._id}/`,
      // isPrivateFile: false,
    },
    async function (error, result) {
      if (error) {
        return next(new ErrorResponse(`Can't upload image`, 500));
      } else {
        await News.findByIdAndUpdate(req.params.id, {
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
