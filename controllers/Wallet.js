const Wallet = require('../models/wallet');
const WalletValue = require('../models/walletValue');
const Transaction = require('../models/Transactions');
const respHandler = require('../services/responseHandler');
const validate = require('../services/validateService');
const validator = require('express-validator/check');

const bcrypt = require('bcrypt');
const config = require('../config/constants');


const AdminController = {
    returnMessage: function (req, res, next) {
        respHandler.sendSuccess(res, 200, 'Please specify the endpoint!', {});
    },
    walletBalance: (req, res, next) => {
        try {
            if(!req.body || !req.body.userId) {
                // WalletValue.deleteMany({}, function (err, success) {  })
                respHandler.sendError(res, 403, 'FAILURE', 'Credential not found.', {});
            }
            Wallet.findOne({userId: req.body.userId}, function (err, wallet) {
                if(err) throw  err;
                console.log('Wallet ', wallet );
                if(!validate.isEmptyObject(wallet)){
                    try {
                        console.log('Wallet is empty')
                        WalletValue.findOne({walletId: wallet._id}, 'amount _id', (_err, value) => {
                            if(_err) throw _err;
                            if(!validate.isEmptyObject(value)){
                                respHandler.sendSuccess(res, 200, 'User amount retrieved', {walletBalance: value.amount});
                            } else {
                                Wallet.deleteMany({userId: req.body.userId}, function (err, success) {
                                    if(success && success.length > 0){
                                        success.forEach((success_) => {
                                        WalletValue.deleteMany({walletId: success_._id}, function (err, success) {  })
                                    });
                                    }

                                    respHandler.sendError(res, 400, 'FAILURE', 'Unable to get wallet balance', err);
                                })
                            }
                        })
                    }
                    catch (_err) {
                        respHandler.sendError(res, 400, 'FAILURE', 'Unable to get wallet', err);
                    }
                } else {
                    respHandler.sendError(res, 400, 'FAILURE', 'User has no wallet', err);
                }
            })
        } catch (err) {
            console.log('Error ', err);
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to get wallet', err);
        }
    },
    createWallet: (req, res, next) => {
        try {
            if(!req.body || !req.body.userId) {
                respHandler.sendError(res, 403, 'FAILURE', 'Credential not found.', {});
            }
            Wallet.findOne({userId: req.body.userId}, function (err, wallet) {
                if(err) throw  err;
                if(!validate.isEmptyObject(wallet)){
                    respHandler.sendError(res, 403, 'FAILURE', 'Unable to create another wallet', {});
                } else {
                    try {
                        Wallet.create({userId: req.body.userId}, function (err, wallet) {
                            if(err) throw err;
                           if(!validate.isEmptyObject(wallet)){
                               WalletValue.create({walletId: wallet._id, amount: 0, digit: 0, currency: 'NGN'}, (_err, value) => {
                                   if(_err) throw _err;
                                   if(!validate.isEmptyObject(value)){
                                       respHandler.sendSuccess(res, 200, 'User wallet created successfully', {});
                                   } else {
                                       respHandler.sendError(res, 400, 'FAILURE', 'Unable to create wallet, rolling back', err);
                                       Wallet.deleteMany({userId: req.body.userId}, function (err, success) {
                                           WalletValue.deleteMany({walletId: success._id}, function (err, success) {  })
                                       })
                                   }
                               })
                           }

                        });

                    }
                    catch (_err) {
                        respHandler.sendError(res, 400, 'FAILURE', 'Unable to create wallet', err);
                    }
                }
            })
        } catch (err) {
            console.log('Error ', err);
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to get wallet', err);
        }
    },
    disableWallet: (req, res, next) => {
        try {
            if(req.body) {
                Wallet.findOneAndUpdate({$and: [{userId: req.body.userId}, {walletCode: req.body.walletCode}]}, {$set: {status: 'Disabled'}}, {new: true},  (err, wallet) => {
                    if (err) throw err;
                    if(validate.resultFound(wallet, res)) {
                        const data = validate.formatData(wallet);
                        respHandler.sendSuccess(res, 200, 'User wallet disabled', data);
                    }
                })
            }
        } catch(err) {
            respHandler.sendError(res, 404, 'FAILURE', 'Unable to disable user wallet.', err);
        }
    },
    enableWallet: (req, res, next) => {
        try {
            if(req.body) {
                Wallet.findOneAndUpdate({$and: [{userId: req.body.userId}, {walletCode: req.body.walletCode}]}, {$set: {status: 'Enabled'}}, {new: true},  (err, wallet) => {
                    if (err) throw err;
                    if(validate.resultFound(wallet, res)) {
                        const data = validate.formatData(wallet);
                        respHandler.sendSuccess(res, 200, 'User wallet enabled', data);
                    }
                })
            }
        } catch(err) {
            respHandler.sendError(res, 404, 'FAILURE', 'Enabling user wallet failed.', err);
        }
    },
    fundWallet: (req, res, next) => {
        try {
           console.log('Req ', req.body);
           // Todo: This will implemented in the best way possible
            respHandler.sendSuccess(res, 200, 'Funding wallet not implemented yet!', {});
        } catch(err) {
            respHandler.sendError(res, 404, 'FAILURE', 'Enabling user wallet failed.', err);
        }
    }
};

module.exports = AdminController;

