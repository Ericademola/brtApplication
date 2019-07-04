const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const brtRoute = require('./brtRoutes');

const brtRoutesSchema = new Schema({
    source: {
        type: String,
        lowercase: true,
        required: [true, 'Source is required!']
    },
    destination: {
        type: String,
        lowercase: true,
        required: [true, 'Destination is required!']
    },
    zone: {
        type: String
    },
    price: {
        type: String,
        required: [true, 'Price is required!']
    },
    code: {
        type: String,
        required: [true, 'Code is required!']
    },
    currency: {
        type: String,
        default: 'NGN',
    }
}, {
    timestamps: true
});

brtRoutesSchema.plugin(uniqueValidator);
brtRoutesSchema.index({ source: 1, destination: 1 }, { unique: true });

const BrtRoutes = mongoose.model('BrtRoutes', brtRoutesSchema);
// const brt = new BrtRoutes();




// make this available to our Node applications
module.exports = BrtRoutes;