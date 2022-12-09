const mongoose = require('mongoose');
const { Schema } = mongoose;
const homeBannerSchema = Schema({
  image: {
    type: String,
    required: true,
  },
  captionText1: {
    type: String,
    required: true,
  },
  captionText2: {
    type: String,
    required: true,
  },
  captionText3: {
    type: String,
  },
  captionText4: {
    type: String,
  },
  altText: {
    type: String,
    required: true,
  },
});

homeBannerSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

homeBannerSchema.set('toJSON', {
  virtuals: true,
});

exports.HomeBanners = mongoose.model('homebanners', homeBannerSchema);
