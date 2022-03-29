const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// Load env vars
dotenv.config({
  path: `${__dirname}/config/config.env`,
});

// Connect to DB
connectDB();

// Route files
const news = require("./routes/news");
const event = require("./routes/event");
const talk = require("./routes/talk");
const statement = require("./routes/statement");
const about = require("./routes/about");
const author = require("./routes/author");
const hashtag = require("./routes/hashtag");
const note = require("./routes/note");
const book = require("./routes/book");
const auth = require("./routes/auth");
const user = require("./routes/user");
const topic = require("./routes/bookTopic");
const member = require("./routes/member");

const app = express();

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Fileupload
app.use(fileupload());

// Sanitize Data
app.use(mongoSanitize());

// Set security heasers
app.use(helmet());

// Prevent XSS attacks
// app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable cors
const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
// app.use(cors());

// Moutn Router
app.use("/api/v1/news", news);
app.use("/api/v1/events", event);
app.use("/api/v1/talks", talk);
app.use("/api/v1/statements", statement);
app.use("/api/v1/about", about);
app.use("/api/v1/author", author);
app.use("/api/v1/hashtag", hashtag);
app.use("/api/v1/notes", note);
app.use("/api/v1/books", book);
app.use("/api/v1/users", user);
app.use("/api/v1/auth", auth);
app.use("/api/v1/bookTopics", topic);
app.use("/api/v1/members", member);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

// Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(err);
  console.log(`unhandledRejection: ${err.messgae}`.red);
  server.close(() => process.exit(1));
});
