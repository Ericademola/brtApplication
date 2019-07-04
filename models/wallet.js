const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const respHandler = require('../services/responseHandler');
const nanoid = require('nanoid');
const uniqueValidator = require('mongoose-unique-validator');

// create a user schema
const walletSchema = new Schema({
    userId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        dropDups: true,
        required: true
    },
    walletCode: {
        type: String,
        default: nanoid() + '-000-' + nanoid().toString().split('').reverse().join(''),
        unique: true,
        dropDups: true,
        trim: true
    },
    status: {
        type: String,
        default: 'Disabled'
    }
}, {
    timestamps: true
});

walletSchema.plugin(uniqueValidator);
try {
    walletSchema.post('save', function (doc, next) {
        doc.populate('userId').execPopulate().then(function() {
            console.log('Before saving');
            next();
        });
    })
} catch (error) {
    console.log('Eroor occurred');
}
const Wallet = mongoose.model('Wallet', walletSchema);
walletSchema.index({ walletCode: 1, userId: 1 }, { unique: true });

// make this available to our Node applications
module.exports = Wallet;