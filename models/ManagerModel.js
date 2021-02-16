var mongoose = require("mongoose");

const ManagerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  account_id: mongoose.Schema.Types.ObjectId,
});

const Manager = mongoose.model("Manager", ManagerSchema);

module.exports = Manager;
