const mongoose = require('mongoose');
const { Schema } = mongoose;
const serviceCategoriesSchema = Schema({
  categName: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
});

serviceCategoriesSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

serviceCategoriesSchema.set('toJSON', {
    virtuals:true,
});

exports.ServiceCategoriesModel = mongoose.model(
  'ServiceCategories',
  serviceCategoriesSchema
);