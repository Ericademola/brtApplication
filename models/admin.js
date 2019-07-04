const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

// create a setting schema
const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        dropDups: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        uniqueCaseInsensitive: true,
        dropDups: true,
        trim: true,
        lowercase: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        validate: {
            validator: function (v) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    avatar_url: {
        type: String
    },
    gender: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    country: {
        type: String
    },
    permission: {
        type: Array,
        default: ['USER']
    }
}, {
    timestamps: true
});


adminSchema.plugin(uniqueValidator);

const Admin = mongoose.model('Admin', adminSchema);

// make this available to our Node applications
module.exports = Admin;