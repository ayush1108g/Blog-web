const mongoose = require("mongoose");

const contactusSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
  },
  subject: {
    type: String,
    required: [true, "Please provide a subject"],
  },
  message: {
    type: String,
    required: [true, "Please provide a message"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Contactus", contactusSchema);
