var mongoose = require("mongoose");

const ArticlesSchema = new mongoose.Schema({
  name: String,
  desc: String,
  img: {
    type: String,
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
});

const Articles = mongoose.model("Articles", ArticlesSchema);

module.exports = Articles;
