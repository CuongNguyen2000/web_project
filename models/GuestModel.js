var mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema({
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

const Guest = mongoose.model("Guest", GuestSchema);

module.exports = Guest;
