const Comment = require("../models/comment");
const Blog = require("../models/blog");
const catchAsync = require("../utils/catchasync");
const AppError = require("../utils/appError");

exports.getAllcommentsofBlog = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;
  const comments = await Comment.find({ blogId }).populate("userId");

  res.status(201).json({
    status: "success",
    comments,
    length: comments.length,
  });
});

exports.postComment = catchAsync(async (req, res, next) => {
  const { comment, blogId, userId } = req.body;
  let newComment = await Comment.create({
    comment,
    blogId,
    userId,
  });
  newComment = await Comment.findById(newComment._id).populate("userId");
  res.status(201).json({
    status: "success",
    comment: newComment,
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const { id, comment } = req.body;
  const updatedComment = await Comment.findById(id).populate("userId");
  if (!updatedComment) {
    return next(new AppError("Comment not found", 404));
  }
  updatedComment.comment = comment;
  await updatedComment.save();

  res.status(201).json({
    status: "success",
    comment: updatedComment,
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const comment = await Comment.findByIdAndDelete(commentId);
  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }
  res.status(201).json({
    status: "success",
    message: "Comment deleted successfully",
  });
});

exports.addlikedislike = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const { type, userId } = req.body;
  const comment = await Comment.findById(commentId).populate("userId");
  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }
  if (type === "like") {
    if (comment.like.includes(userId)) {
      comment.like = comment.like.filter((el) => el !== userId);
    } else {
      comment.like.push(userId);
      comment.dislike = comment.dislike.filter((el) => el !== userId);
    }
  } else {
    if (comment.dislike.includes(userId)) {
      comment.dislike = comment.dislike.filter((el) => el !== userId);
    } else {
      comment.dislike.push(userId);
      comment.like = comment.like.filter((el) => el !== userId);
    }
  }
  await comment.save();

  res.status(201).json({
    status: "success",
    comment,
  });
});
