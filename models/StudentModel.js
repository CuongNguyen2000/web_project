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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Articles",
      },
    },
  ],
  account_id: mongoose.Schema.Types.ObjectId,
  faculty_id: mongoose.Schema.Types.ObjectId,
});

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
