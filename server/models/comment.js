const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, "Please provide a comment"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  blogId: {
    type: String,
    required: [true, "Please provide blog id"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user id"],
  },
  like: {
    type: [String],
    default: [],
  },
  dislike: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Comment", commentSchema);
