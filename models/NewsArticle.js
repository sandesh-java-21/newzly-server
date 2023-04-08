const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "users",
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
  reading_time: {
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
