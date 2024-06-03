const express = require("express");
const router = express.Router();

const blogController = require("../controllers/blogController");

router.get("/", blogController.getAll);

router.post("/addblog", blogController.postBlog);
router
  .route("/blog/:id")
  .get(blogController.getById)
  .patch(blogController.updateBlog);

module.exports = router;
