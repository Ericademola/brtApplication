const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const respHandler = require('../services/responseHandler');
const nanoid = require('nanoid');
const uniqueValidator = require('mongoose-unique-validator');

// create a user schema
const ticketSchema = new Schema({
    userId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    routeId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'BrtRoutes',
        required: true
    },
    barcode: {
      type: String,
      default: '000000'
    },
    paymentOptionId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'PaymentOption',
        required: true
    },
    transactionRef: {
        type:  String
    },
    isValid: {
        type: Boolean,
        default: true
    },
    destroyed: {
        type: Boolean,
        default: false
    },
    generatedDate: {
        type: Date,
        default: moment(Date.now())
    },
    usedDate: {
        type: Date
    },
    expiredIn: {
        type: Date,
        default:  moment(Date.now()).add(24, 'hours')// add expiring date time
    },
    isExpired: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
ticketSchema.post('save', function(doc, next) {
    doc.populate('userId').populate('routeId').populate('paymentOptionId').execPopulate().then(function() {
// console.log('After saving');
        next();
    });
});
ticketSchema.plugin(uniqueValidator);
const Tickets = mongoose.model('Ticket', ticketSchema);

// make this available to our Node applications
module.exports = Tickets;