const mongoose = require('mongoose');
const { Schema } = mongoose;
const busesSchema = Schema({
    itemCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Categories',
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    itemDesc: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    quality: {
        type: Schema.Types.ObjectId,
        ref: 'ItemQualities',
        required: true,
    },
    rates: [{
        unit: {
            type: Schema.Types.ObjectId,
            ref: 'Units',
            required: true,
        },
        cost: {
            type: Number,
            required: true,
        },
    }],
    discountPercent: {
        type: Number,
        required: false,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    ratings: {
        type: Number,
        default: 0,
    },
});

busesSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

busesSchema.set('toJSON', {
    virtuals: true,
});

exports.BusesModel = mongoose.model('buses', busesSchema)