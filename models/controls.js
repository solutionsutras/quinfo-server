const mongoose = require('mongoose');
const { Schema } = mongoose;
const controlsSchema = Schema({
  recType:{
	type: String,
    required: true,
  },
  fieldName: {
    type: String,
    required: true,
  },
  fieldValue: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    default: '',
  },
  createdByUser: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  lastUpdatedByUser: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    required: true,
  },
});

controlsSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

controlsSchema.set('toJSON', {
    virtuals:true,
});

exports.Controls = mongoose.model('Controls', controlsSchema);