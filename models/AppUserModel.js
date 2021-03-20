var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

const AppUserSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 4,
    maxlength: 100,
    required: true,
  },
  password: {
    type: String,
    minlength: 4,
    maxlength: 255,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "student", "coordinator", "manager", "guest"],
    default: "student",
  },
  // detailAccount: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     refPath: "onModel",
  //   },
  // ],
  // onModel: {
  //   type: String,
  //   enum: ["Student", "Manager", "Coordinator", "Guest"],
  // },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
});

AppUserSchema.path("password").set((inputString) => {
  return (inputString = bcrypt.hashSync(
    inputString,
    bcrypt.genSaltSync(10),
    null
  ));
});

const AppUser = mongoose.model("AppUser", AppUserSchema);

module.exports = AppUser;
