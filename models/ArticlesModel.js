var mongoose = require("mongoose");

const ArticlesSchema = new mongoose.Schema({
  name: String,
  desc: String,
  img: {
    data: Buffer,
    type: String,
  },
});

const Articles = mongoose.model("Articles", ArticlesSchema);

module.exports = Articles;
