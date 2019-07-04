const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

// create a setting schema
const paymentOptionSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        uniqueCaseInsensitive: true,
        dropDups: true,
        trim: true,
        enum: ['BANK ACCOUNT', 'DEBIT CARD', 'USSD', 'WALLET']
    },
    description: {
      type: String
    },
    ref: {
      type: String
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});


paymentOptionSchema.plugin(uniqueValidator);

const PaymentOptions = mongoose.model('PaymentOption', paymentOptionSchema);

// make this available to our Node applications
module.exports = PaymentOptions;