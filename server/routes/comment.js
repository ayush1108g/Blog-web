const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");

router
  .route("/:blogId")
  .get(commentController.getAllcommentsofBlog)
  .post(commentController.postComment)
  .patch(commentController.updateComment);

router
  .route("/update/:commentId")
  .patch(commentController.addlikedislike)
  .delete(commentController.deleteComment);

module.exports = router;
