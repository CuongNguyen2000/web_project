var mongoose = require("mongoose");

const ArticlesSchema = new mongoose.Schema({
  name: String,
  desc: String,
  articleImage: {
    type: String,
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
  faculty_id: mongoose.Schema.Types.ObjectId,
});

ArticlesSchema.virtual("student", {
  ref: "Student",
  localField: "_id",
  foreignField: "posts.post",
});

const Articles = mongoose.model("Articles", ArticlesSchema);

module.exports = Articles;
