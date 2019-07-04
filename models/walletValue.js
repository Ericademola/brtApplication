const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

// create a user schema
const walletValueSchema = new Schema({
    walletId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        uniqueCaseInsensitive: true,
        dropDups: true,
        trim: true,
        unique: true,
        required: true
    },
    currency: {
      type: String,
      default: 'NGN'
    },
    amount: {
        type: Number,
        default: 0.00
    },
    digit: {
        type: String,
        default: '0.00'
    }
}, {
    timestamps: true
});

walletValueSchema.plugin(uniqueValidator);

const WalletValue = mongoose.model('WalletValue', walletValueSchema);

// make this available to our Node applications
module.exports = WalletValue;