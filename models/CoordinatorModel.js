var mongoose = require("mongoose");

const CoordinatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
  },
  faculty_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
  },
});

const Coordinator = mongoose.model("Coordinator", CoordinatorSchema);

module.exports = Coordinator;
