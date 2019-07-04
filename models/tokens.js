const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const respHandler = require('../services/responseHandler');

// create a user schema
const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastUsed: {
        type: Date,
        default: moment(Date.now())
    },
    expiredIn: {
        type: Date,
        default:  moment(Date.now()).add(2, 'hours')// add expiring date time
    },
    expired: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

tokenSchema.pre('save', function (next){
    if((moment(this.lastUsed)).isSameOrAfter(moment(this.expiredIn))){
        this.lastUsed = moment(Date.now());
         console.log('ABOUT TO CREATE A TOKEN');
        // return false;
    } else {
        this.lastUsed = moment(Date.now());
        this.expiredIn = moment(Date.now()).add(2, 'hours');
        console.log('TOKEN TOKEN .ABOUT TO CREATE A TOKEN');
        // next();
    }
    next();
});
const Tokens = mongoose.model('Tokens', tokenSchema);
tokenSchema.index({ token: 1, userId: 1 }, { unique: true });

// make this available to our Node applications
module.exports = Tokens;