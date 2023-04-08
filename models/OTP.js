const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otp_code: { type: String, required: true },
  email: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  expiryAt: {
    type: Date,
    default: new Date(Date.now() + 5 * 60 * 1000),
  },
});

otpSchema.index({ expiryAt: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model("otp_codes", otpSchema);
