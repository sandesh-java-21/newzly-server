const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  author: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  total_reads: {
    type: Number,
    required: false,
    default: 0,
  },
  total_likes: {
    type: Number,
    required: false,
    default: 0,
  },
  total_dislikes: {
    type: Number,
    required: false,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "categories",
  },
});

module.exports = mongoose.model("articles", userSchema);
