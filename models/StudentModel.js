var mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  posts: [
    {
      post: {
        file: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Articles",
        },
      },
    },
  ],
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
  },
  faculty_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
  },
});

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
