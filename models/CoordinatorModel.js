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
  account_id: mongoose.Schema.Types.ObjectId,
  faculty_id: mongoose.Schema.Types.ObjectId,
});

const Coordinator = mongoose.model("Coordinator", CoordinatorSchema);

module.exports = Coordinator;
