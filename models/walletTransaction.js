const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

// create a user schema
const walletTransSchema = new Schema({
    userId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    walletId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },
    amount: {
        type: String
    },
    transactionId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    },
    transactionType: {
        type: String,
        enums: ['Paid_in', 'Paid_out']
    }
}, {
    timestamps: true
});

walletTransSchema.plugin(uniqueValidator);

const WalletTransactions = mongoose.model('WalletTransaction', walletTransSchema);
// walletTransSchema.index({ walletCode: 1, userId: 1 }, { unique: true });

// make this available to our Node applications
module.exports = WalletTransactions;