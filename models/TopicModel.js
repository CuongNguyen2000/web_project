var mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
});

const Topic = mongoose.model("Topic", TopicSchema);

module.exports = Topic;
