const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email_address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  phone_no: {
    type: String,
    required: true,
  },
  vouchers: {
    type: Array,
    required: false,
    default: [],
  },
  total_coins: {
    type: Number,
    required: false,
    default: 100,
  },
  posted_news_articles: {
    type: Array,
    required: false,
    default: [],
  },
  area_of_interest: {
    type: Array,
    required: false,
    default: [],
  },
  is_verified: {
    type: Boolean,
    required: false,
    default: false,
  },

  profile_image: {
    url: {
      type: String,
      required: false,
      default: "",
    },
    public_id: {
      type: String,
      required: false,
      default: "",
    },
  },

  notification_token: {
    type: String,
    required: false,
    default: "",
  },
});

module.exports = mongoose.model("users", userSchema);
