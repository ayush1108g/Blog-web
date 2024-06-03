const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:8000",
      "https://ayush1108g.github.io",
      "https://cp29bd07-3000.inc1.devtunnels.ms",
      "https://blog-web-gules.vercel.app",
      process.env.FRONTEND_URL,
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  // Allow all origins defined in the cors configuration
  console.log("CORS", req.headers.origin);
  res.header("Access-Control-Allow-Origin", [req.headers.origin]);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const globalErrorHandler = require("./controllers/errorController.js");
const AppError = require("./utils/appError.js");
const BlogRouter = require("./routes/blog");
const AuthRouter = require("./routes/auth");
const CommentRouter = require("./routes/comment");
const ContactUsRouter = require("./routes/contactus");
const FileUploadRouter = require("./routes/fileUpload");
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("MORGAN");
}

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/blogs", BlogRouter);
app.use("/api/v1/comments", CommentRouter);
app.use("/api/v1/contactus", ContactUsRouter);
app.use("/api/v1/fileupload", FileUploadRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
