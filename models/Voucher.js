const mongoose = require("mongoose");

const voucherSchema = mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: "",
  },
  voucher_code: {
    type: String,
    required: true,
    default: "",
  },
  discount: {
    type: Number,
    required: false,
    default: 0,
  },
  is_active: {
    type: Boolean,
    required: false,
    default: true,
  },

  usage_limit: {
    type: Number,
    required: false,
  },

  usageCount: {
    type: Number,
    default: 0,
    required: false,
  },

  image: {
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

  expiry_date: {
    type: Date,
    required: false,
  },
});

var voucherModel = mongoose.model("vouchers", voucherSchema);

module.exports = voucherModel;
