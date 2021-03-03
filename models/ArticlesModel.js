var mongoose = require("mongoose");

const ArticlesSchema = new mongoose.Schema({
  name: String,
  desc: String,
  status: {
    type: Boolean,
    default: false,
  },
  articleImage: {
    type: String,
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
  faculty_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
  },
  topic_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
  },
});

ArticlesSchema.virtual("student", {
  ref: "Student",
  localField: "_id",
  foreignField: "posts.post",
});

const Articles = mongoose.model("Articles", ArticlesSchema);

module.exports = Articles;
