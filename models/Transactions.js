const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

// create a user schema
const TransactionsSchema = new Schema({
    userId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transRef: {
        type:  String
    },
    amount: {
        type: String
    },
    paymentOptionInfo: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'PaymentOption',
    },
    routeInfo: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'BrtRoute',
    },
    walletBalBeforeTrans: {
        type: String
    },
    walletBalAfterTrans: {
        type: String
    },
    transactionType: {
        type: String,
        enums: ['Paid_in_to_account', 'Paid_out_of_account']
    },
    transactionPurpose: {
      type: String,
        enum: ['PAY_TO_WALLET', 'BUY_TICKET']
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed']
    },
    paymentInformation: {

    },
    others: {

    }
}, {
    timestamps: true
});

TransactionsSchema.plugin(uniqueValidator);

const Transactions = mongoose.model('Transaction', TransactionsSchema);
// TransactionsSchema.index({ walletCode: 1, userId: 1 }, { unique: true });

// make this available to our Node applications
module.exports = Transactions;