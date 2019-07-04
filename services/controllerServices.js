
const Tokens = require('../models/tokens');
const jwt = require('jsonwebtoken');
const config = require('../config/constants');
const moment = require('moment');
const controllerServices = {

    checkAuthorizationToken: function (req, res, next, callback) {
        console.log('Authorization: ', req.headers.authorization);
        if(req.headers && req.headers.authorization){
            const authorization = req.headers.authorization;
            try {
                const decodedUser = jwt.verify(authorization, config.SECRETENTITY);
                confirmDataValidation(decodedUser, req, res, next, callback);
            } catch (e) {
                sendError(res, 401, 'FAILURE', 'User not authorized to perform action.');
            }
        } else {
            sendError(res, 401, 'FAILURE', 'Authorization failed, token not provided');
        }
    },
    convertDataToJWT: function(data) {
        const jsonData = JSON.parse(JSON.stringify(data));
        return jwt.sign(jsonData, config.SECRETENTITY, {
            expiresIn: '1 year' // expires in 1 year
        });
    }
};
module.exports = controllerServices;

function confirmDataValidation(decodedUser, req, res, next, cb) {
    checkSecretValidityV1(decodedUser, req, res, next, cb)
}

function checkSecretValidityV1(decodedUser, req, res, next, cb) {
console.log('decodedUser', decodedUser);
if(decodedUser['accessKey'] === config.ACCESS_KEY){
    checkSecretValidity(decodedUser, req, res, next, cb);
} else {
    sendError(res, 401, 'FAILURE', 'Authorization failed, token is not valid or has expired');
}
return false;

}
function checkSecretValidity(decodedUser, req, res, next, cb) {
    // console.log('Decoded User ,', decodedUser);
    Tokens.findOne({$and: [{token: decodedUser.secretToken},{userId: decodedUser._id}]}, function (err, tokenSet) {
        if(!tokenSet || tokenSet.length === 0) {
            sendError(res, 401, 'FAILURE', 'Authorization failed, token is not valid or has expired');
            // next();
        } else {
            if (!tokenSet && tokenSet.expired === true) {
                deleteTheToken(decodedUser, req, res, next);
            } else if(tokenSet && moment(Date.now()).isAfter(moment(tokenSet.expiredIn))) {
              //  console.log('failed token', tokenSet);
                deleteTheToken(decodedUser, req, res, next);
            } else {
             //   console.log('failed update', tokenSet);
                updateSecretToken(decodedUser, req, res, next, cb)
            }
        }
    });
    return false;
}

function deleteTheToken(decodedUser, req, res, next) {
    Tokens.findOneAndRemove({$or: [{token: decodedUser.secretToken}, {userId: decodedUser._id}]}, function (err, tokenSet) {
        sendError(res, 401, 'FAILURE', 'Token timeout');
    });
}

function updateSecretToken(decodedUser, req, res, next, callback) {
// set either expired or lastUsed
   const addHours =  moment(Date.now()).add(2, 'hours');
    Tokens.findOneAndUpdate({$and: [{token: decodedUser.secretToken}, {userId: decodedUser._id}]}, {$set: {lastUsed: Date.now(), expiredIn: addHours, expired: false}}, {new: true},
        function (err, tokenSet) {
            callback(req, res, next);
    });
}


function sendError (res, code, status, message, error){
    const err = new Error(message);
    err.status = status;
    err.code = code;
    err.msg = message;
    (error) ? err.ERROR = error : '';
    res.status(code).send(err);
}