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
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  comments: [
    {
      comment: String,
      timeCreated: {
        type: Date,
        default: () => Date.now(),
      },
    },
  ],
});

ArticlesSchema.virtual("student", {
  ref: "Student",
  localField: "_id",
  foreignField: "posts",
});

ArticlesSchema.virtual("amount_article", {
  ref: "Faculty",
  localField: "_id",
  foreignField: "amountArticle",
});

// ArticlesSchema.set("toObject", { virtuals: true });
// ArticlesSchema.set("toJSON", { virtuals: true });

const Articles = mongoose.model("Articles", ArticlesSchema);

module.exports = Articles;
