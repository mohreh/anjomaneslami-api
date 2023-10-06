const Book = require("../models/Book");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const imagekit = require("../utils/imagekit");

// @desc      Get all books
// @route     GET /api/v1/books
// @access    Public
exports.getAllBooks = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult);
});

// @desc      Get book with all review
// @route     GET /api/v1/books/:id
// @access    Public
exports.getBookWithAllReview = asyncHandler(async (req, res, next) => {
  if (!req.cookies.views) {
    res.cookie("views", req.params.id + ",", {
      expiresIn: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 30 * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
    });

    await Book.findByIdAndUpdate(req.params.id, { $inc: { viewsCount: 1 } });
  } else {
    if (!req.cookies.views.includes(req.params.id)) {
      res.cookie("views", req.cookies.views + req.params.id + ",", {
        expiresIn: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 30 * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
      });

      await Book.findByIdAndUpdate(req.params.id, { $inc: { viewsCount: 1 } });
    }
  }

  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(
      new ErrorResponse(`Book not fount with id of ${req.params.id}`, 400),
    );
  }

  res.status(200).json({
    success: true,
    data: book,
  });
});

// @desc      Delete book
// @route     GET /api/v1/books/:id
// @access    Public
exports.deleteBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(
      new ErrorResponse(`Book not fount with id of ${req.params.id}`, 400),
    );
  }

  await book.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Get single book with part of review
// @route     GET /api/v1/books/:id/:indexId
// @access    Public
exports.getBookWithSingleReview = asyncHandler(async (req, res, next) => {
  if (!req.cookies.views) {
    res.cookie("views", req.params.id + ",", {
      expiresIn: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 30 * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
    });

    await Book.findByIdAndUpdate(req.params.id, { $inc: { viewsCount: 1 } });
  } else {
    if (!req.cookies.views.includes(req.params.id)) {
      res.cookie("views", req.cookies.views + req.params.id + ",", {
        expiresIn: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 30 * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
      });

      await Book.findByIdAndUpdate(req.params.id, { $inc: { viewsCount: 1 } });
    }
  }

  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(
      new ErrorResponse(`Book not fount with id of ${req.params.id}`, 400),
    );
  }

  const content = await Book.findById(req.params.id).select({
    content: { $elemMatch: { _id: req.params.indexId } },
  });

  console.log(content);

  if (!content.content.length) {
    return next(new ErrorResponse("Content not Founded", 404));
  }

  delete book._doc.content;

  res.status(200).json({
    success: true,
    data: {
      ...book._doc,
      content: content.content,
    },
  });
});

// @desc      Update book
// @route     PUT /api/v1/books/:id/
// @access    Public
exports.updateBook = asyncHandler(async (req, res, next) => {
  let book = await Book.findById(req.params.id);

  if (!book) {
    return next(
      new ErrorResponse(`Book not fount with id of ${req.params.id}`, 400),
    );
  }

  if (req.body.content) {
    delete req.body.content;
  }

  if (req.user.role !== "admin") {
    req.body.author = req.user.author;
  }

  book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: book,
  });
});

// @desc      Create book
// @route     POST /api/v1/books/
// @access    Public
exports.createBook = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    req.body.author = req.user.author;
  }

  const book = await Book.create(req.body);

  res.status(200).json({
    success: true,
    data: book,
  });
});

// @desc      Add review to a book
// @route     POST /api/v1/books/:id
// @access    Public
exports.addReviewToBook = asyncHandler(async (req, res, next) => {
  let book = await Book.findById(req.params.id);

  if (!book) {
    return next(
      new ErrorResponse(`Book not fount with id of ${req.params.id}`, 400),
    );
  }

  book = await Book.findByIdAndUpdate(
    req.params.id,
    {
      $push: { content: req.body },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    success: true,
    data: book,
  });
});

// @desc      remove review from a book
// @route     POST /api/v1/books/:id/:indexId
// @access    Public
exports.removeReviewFromBook = asyncHandler(async (req, res, next) => {
  let book = await Book.findById(req.params.id);

  if (!book) {
    return next(
      new ErrorResponse(`Book not fount with id of ${req.params.id}`, 400),
    );
  }

  const content = await Book.findById(req.params.id).select({
    content: { $elemMatch: { _id: req.params.indexId } },
  });

  if (!content.content.length) {
    return next(new ErrorResponse("Content not Founded", 404));
  }

  book = await Book.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { content: { _id: req.params.indexId } },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    success: true,
    data: book,
  });
});

// @desc      update review in a book
// @route     PUT /api/v1/books/:id/:indexId
// @access    Public
exports.updateReviewInBook = asyncHandler(async (req, res, next) => {
  let book = await Book.findById(req.params.id);

  if (!book) {
    return next(
      new ErrorResponse(`Book not fount with id of ${req.params.id}`, 400),
    );
  }

  const content = await Book.findById(req.params.id).select({
    content: { $elemMatch: { _id: req.params.indexId } },
  });

  if (!content.content.length) {
    return next(new ErrorResponse("Content not Founded", 404));
  }

  req.body._id = req.params.indexId;

  book = await Book.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        "content.$[el]": req.body,
      },
    },
    {
      arrayFilters: [{ "el._id": req.params.indexId }],
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    success: true,
    data: book,
  });
});
