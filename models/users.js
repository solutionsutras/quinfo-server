const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    passwordHash:{
        type: String,
        required: true,
    },
    userRoll:{
        type: String,
        default: 'user',
    },
    address:{
        type: String,
        default: '',
    },
    city:{
        type: String,
        default: '',
    },
    pin:{
        type: String,
        default: '',
    },
    state:{
        type: String,
        default: '',
    },
    country:{
        type: String,
        default: '',
    },
    avtar:{
        type: String,
        default: '',
    }
});

userSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals:true,
});


exports.Users = mongoose.model('Users', userSchema)