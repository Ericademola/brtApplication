const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

// create a OTP schema
const otpSchema = new Schema({
    transactionId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true
    },
    userId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transactionRef: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

otpSchema.plugin(uniqueValidator);

const OTP = mongoose.model('OTP', otpSchema);

// make this available to our Node applications
module.exports = OTP;