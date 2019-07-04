const Users = require('../models/users');
const respHandler = require('../services/responseHandler');
const validate = require('../services/validateService');
const jwt    = require('jsonwebtoken');
const config = require('../config/constants');
const bcrypt = require('bcrypt');
const Tokens = require('../models/tokens');
const nanoid = require('nanoid');
const moment = require('moment');


const AuthenticationController = {
    returnMessage: function (req, res, next) {
            respHandler.sendSuccess(res, 200, 'Please specify the endpoint!', {});
    },
    logoutUser: (req, res, next) => {
        systemLogout(req, res, next);
    },
    sendResendLink: (req, res, next) => {},
    resetPassword: (req, res, next) => {},
    startUser: (req, res, next) => {
        detectUser(req, res, next);
    }
};

module.exports = AuthenticationController;

function generateJWT(user, secret, req, res, next) {
    try {
        const jsonUser = user.toJSON();
        jsonUser.secretToken = secret;
        jsonUser.accessKey = config.ACCESS_KEY;

        const token = jwt.sign(jsonUser, config.SECRETENTITY, {
            expiresIn: '2 hours' // expires in 2 hours
        });
        console.log('Process token');
        sendTokenToUser(token, req, res, next);
    } catch (error) {
        console.log('Error 3 ', error);
    }
}
function sendTokenToUser(userToken, req, res, next){
    respHandler.sendSuccess(res, 200, 'User authentication successful', userToken, 'USERLOGIN');
}
function detectUser(req, res, next) {
    const user = req.body;
    if(user.username){
        try {
            Users.findOne({username: req.body.username}, function (err, user) {
                if (err) throw err;
                console.log('Users ', user);
                console.log('Hellow ');
                if(null === user){
                    console.log('User does not exist'); // create the user
                    createNewUser(req, res, next);
                    return false;
                }
                if(user && user.confirmedUser){ //  && user.confirmedUser Todo: Handle the confirmed User Later
                    console.log('User has a confirmed account');
                    // Login to user account
                    bcrypt.compare(req.body.password, user.password, (err, response) => {
                        console.log(err, response);
                        if(!response) {
                            respHandler.sendError(res, 401, 'FAILURE', 'Password not correct!', err);
                        } else {
                            console.log('Password is correct');
                            user.password = null;
                            user.accessKey = config.ACCESS_KEY;
                            // generateJWT(user, req, res, next);
                            proceedToGenerateToken(user, req, res, next);
                        }
                    });
                } else {
                    console.log('User account is not confirmed');
                    // ask confirmation Todo: A service that verify and confirm the user account is called here.
                    // Todo: This user is not expected to login without account verification and input of password
                    console.log('Password is correct');
                    user.password = null;
                    // generateJWT(user, req, res, next);
                    proceedToGenerateToken(user, req, res, next);
                }
            });
        } catch (err) {
            console.log('Error ', err);
        }
    } else {
        respHandler.sendError(res, 403, 'FAILURE', 'No username provided!');
    }
}

function proceedToGenerateToken(user, req, res, next) {
    // get JWT implementation here
    try {
        const secretToken = nanoid(); // random string to be save to db as auth procedure
        console.log('secretToken 2', secretToken);
        saveSecretToken(secretToken, user, req, res, next);
    } catch (error) {
        console.log('Error Occurred: ', error);
    }

}

function createNewUser(req, res, next) {
    console.log('Res ', req.body);
    if (req.body && req.body.username){
        Users.create(req.body, function (err, user) {
            console.log('Created 2', user);
            setTimeout(() => {
                detectUser(req, res, next);
            }, 0);
        });
    } else {
        respHandler.sendError(res, 406, 'FAILURE', 'Please provide username');
    }
}
function saveSecretToken(token_, user, req, res, next) {
    try {
        console.log('Code is here', user, token_);
        const secretToken = {
            token: token_,
            userId: user._id
        };

        Tokens.deleteMany({userId: user._id}, function (err, tokens) {
            console.log('DELETION::', 'Done deleting old recode');
            // if(err) {throw err}
            console.log('Create Token ', secretToken);
            createNewToken(secretToken, user, token_, req, res, next);
        });

    } catch (error) {
        console.log('Error 2____', error);
    }
    finally {}
}

function createNewToken(secretToken, user, token_, req, res, next) {
    console.log('createNewToken createNewToken', secretToken);

    try {

        Tokens.create(secretToken, function (err, token) {
            console.log('Token created', err, token);
            if (err) throw err;
            if (token) {
                console.log('Is it token');
                generateJWT(user, token_, req, res, next);
            } else {
                respHandler.sendError(res, 400, 'FAILURE', 'User authentication failed, retry');
            }
        });
    } catch (error){
        console.log('Error creating new Token');
    }
}

function systemLogout(logout, req, res, next) {
    try {
        Tokens.remove({$or: [{token: logout.token}, {userId: logout.userId}]}, function (err, token) {
            if(token) {
                respHandler.sendSuccess(res, 200, 'User logout successful', token);
            } else {
                respHandler.sendSuccess(res, 200, 'User logout successful with error 0', token);
            }
        });
    } catch (err){
        respHandler.sendError(res, 400, 'FAILURE', 'Unable to register user');
    }
    finally {
        // DELETE ALL EXPIRED TOKENS IN THE SYSTEM
        Tokens.find({}, function (err, tokens) {
            if(tokens) {
                tokens.forEach((token) => {
                    if((moment(token.lastUsed)).isAfter(moment(token.expiredIn))) {
                        Tokens.findByIdAndRemove(token._id, function (err, token) {
                            console.log('Rempve expired tokens');
                        });
                    }
                });
            }
        });
    }
}

