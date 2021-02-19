var mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
});

const Faculty = mongoose.model("Faculty", FacultySchema);

module.exports = Faculty;
