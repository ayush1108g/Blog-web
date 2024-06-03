const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const fileController = require("../controllers/fileUploadController");

router.route("/").post(upload.any(), fileController.uploadAssignmentFile);

module.exports = router;
