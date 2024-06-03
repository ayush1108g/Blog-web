const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  data: {
    type: String,
    required: [true, "Please provide data"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user id"],
  },
  coverImage: {
    type: String,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
