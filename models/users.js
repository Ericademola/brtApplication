const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

// create a setting schema
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        uniqueCaseInsensitive: true,
        dropDups: true,
        trim: true,
        validate: {
            validator: function (v) {
                // return /\d{3}-\d{3}-\d{4}/.test(v);
                return v.length > 10;
            },
            message: props => `${props.value} is not a valid username!`
        }
    },
    name: {
        type: String
    },
    avatar_url: {
        type: String
    },
    gender: {
        type: String
    },
    password: {
        type: String
    },
    country: {
        type: String
    },
    confirmedUser: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

// make this available to our Node applications
module.exports = User;