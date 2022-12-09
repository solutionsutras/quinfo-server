const mongoose = require('mongoose');
const { Schema } = mongoose;
const otpSmsSchema = Schema({
  sender_id: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
  otp: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

otpSmsSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

otpSmsSchema.set('toJSON', {
  virtuals: true,
});

exports.OtpSmsModel = mongoose.model('otpsms', otpSmsSchema);
