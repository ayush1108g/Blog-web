const Blog = require("../models/blog");
const catchAsync = require("../utils/catchasync");
const AppError = require("../utils/appError");

exports.getAll = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find().populate("userId");

  res.status(201).json({
    status: "success",
    blogs,
  });
});

exports.getById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const blog = await Blog.findById(id).populate("userId");
  if (!blog) {
    return next(new AppError("Blog not found", 404));
  }
  res.status(201).json({
    status: "success",
    blog,
  });
});

exports.postBlog = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { title, data, userId, coverImage } = req.body;
  const newBlog = await Blog.create({
    title,
    data,
    userId,
    coverImage,
  });
  res.status(201).json({
    status: "success",
    blog: newBlog,
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const { id, title, data, coverImage } = req.body;
  const updatedBlog = await Blog.findById(id);
  if (!updatedBlog) {
    return next(new AppError("Blog not found", 404));
  }
  if (title) updatedBlog.title = title;
  if (data) updatedBlog.data = data;
  if (coverImage) updatedBlog.coverImage = coverImage;
  await updatedBlog.save();

  res.status(201).json({
    status: "success",
    blog: updatedBlog,
  });
});
