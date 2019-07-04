const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const passwordResetSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});



const PasswordResets = mongoose.model('PasswordReset', passwordResetSchema);

// make this available to our Node applications
module.exports = PasswordResets;