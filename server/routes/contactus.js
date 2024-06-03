const express = require("express");

const router = express.Router();

const contactusController = require("../controllers/contactusController");

router.post("/", contactusController.postContactus);

router.post("/newsletter", contactusController.postNewsletter);

module.exports = router;
