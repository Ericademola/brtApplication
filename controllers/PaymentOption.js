const PaymentOption = require('../models/paymentOption');
const respHandler = require('../services/responseHandler');
const validate = require('../services/validateService');
const validator = require('express-validator/check');
const jwt = require('jsonwebtoken');

const Wallet = require('../models/wallet');
const WalletValue = require('../models/walletValue');
const config = require('../config/constants');


const PaymentOptionController = {
    returnMessage: function (req, res, next) {
        respHandler.sendSuccess(res, 200, 'Please specify the endpoint!', {});
    },
    createPaymentOption: (req, res, next) => {
        try {
            PaymentOption.findOne({name: req.body.name}, function (err, data) {
                if (err) throw err;
                if(null === data){
                    PaymentOption.create(req.body, function (err, paymentOption) {
                        console.log('paymentOption ', paymentOption);
                        if (err) {
                            respHandler.sendError(res, 400, 'FAILURE', err.message, err);
                        }
                        else if(validate.resultFound(paymentOption, res)) {
                            const data = validate.formatData(paymentOption);
                            respHandler.sendSuccess(res, 200, 'Payment Option created successfully', data);
                        }
                    });
                } else {
                    respHandler.sendError(res, 403, 'FAILURE', 'Payment option already exist in the system, update instead.', err);
                }
            });
        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to create payment option');
        }
    },
    getPaymentOptions: (req, res, next) => {
        try {
            const user = jwt.verify(req.headers.authorization, config.SECRETENTITY);
            Wallet.findOne({userId: user._id}, function (err, wallet) {
                if(err) throw err;
                if(wallet && !validate.isEmptyObject(wallet)){
                    WalletValue.findById(wallet._id, function (err, value) {
                        if (err) throw err;
                        if (!validate.isEmptyObject(value)) {
                            const walletValue = parseInt(value.amount, 10);
                            if(walletValue === 0 || Math.sign(value.amount) === -1){
                                getPaymentOption_({$and: [{active: true}, {name: {$ne: 'WALLET'}}]});

                            } else {
                                getPaymentOption_({active: true})
                            }

                        }
                    })
                } else {
                    getPaymentOption_({$and: [{active: true}, {name: {$ne: 'WALLET'}}]})
                }


            });
            function getPaymentOption_(condition) {
                PaymentOption.find(condition, function (err, paymentOptions) {
                    if(err) throw  err;
                    console.log('paymentOptions ', paymentOptions);
                    if (validate.resultFound(paymentOptions, res)){
                        const data = validate.formatData(paymentOptions);





                        respHandler.sendSuccess(res, 200, 'Payment Options listed successfully', data);
                    }
                })
            }
        } catch (err) {
            console.log('Error ', err);
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to list payment options.', err);
        }
    },
    filterPaymentOption: (req, res, next) => {
        try {
            if(req.query.active && typeof(req.query.active) === "boolean"){
                const query = req.query.active;
                PaymentOption.find({active: req.query.active}, function (err, paymentOptions) {
                    if(err) throw  err;
                    console.log('paymentOptions ', paymentOptions);
                    if (validate.resultFound(paymentOptions, res)){
                        const data = validate.formatData(paymentOptions);
                        respHandler.sendSuccess(res, 200, `${(query === true)? 'Active': 'Inactive'} Payment Options listed successfully`, data);
                    }
                })
            } else {
                PaymentOption.find({}, function (err, paymentOptions) {
                    if(err) throw  err;
                    console.log('paymentOptions ', paymentOptions);
                    if (validate.resultFound(paymentOptions, res)){
                        const data = validate.formatData(paymentOptions);
                        respHandler.sendSuccess(res, 200, 'Payment Options listed successfully', data);
                    }
                })
            }
        } catch (err) {
            console.log('Error ', err);
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to list payment options.', err);
        }
    },
    getPaymentOption: (req, res, next) => {
        try {
            PaymentOption.findById(req.params.id, function (err, paymentOption) {
                if(err) throw  err;
                console.log('paymentOption ', paymentOption);
                if (validate.resultFound(paymentOption, res)){
                    const data = validate.formatData(paymentOption);
                    respHandler.sendSuccess(res, 200, 'Payment Option listed successfully', data);
                }
            })
        } catch (err) {
            console.log('Error ', err);
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to get payment option.', err);
        }
    },
    updatePaymentOption: (req, res, next) => {
        try {
            console.log('This is body ', req.body);
            PaymentOption.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function (err, paymentOption) {
                if (err) throw err;
                if(paymentOption) {
                    respHandler.sendSuccess(res, 200, 'Payment Option updated successfully!', paymentOption);
                }
            });
        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to update payment option');
        }
    },
    deletePaymentOption: (req, res, next) => {
        try {
            PaymentOption.deleteOne(req.params.id, function (err, paymentOption) {
                if (err) throw err;
                respHandler.sendSuccess(res, 200, 'Payment Option deleted successfully!', {});
            });
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to delete payment option');
        }
    },
    disablePaymentOption: (req, res, next) => {
        try {
            console.log('Req Body', req.body.active);
            if(req.body.active === undefined){
                respHandler.sendError(res, 400, 'FAILURE', 'Request cannot be completed due to malformed data!.');
            } else {
                PaymentOption.findByIdAndUpdate(req.params.id, {$set: {active: false}}, {new: true}, function (err, paymentOption) {
                    if (err) throw err;
                    respHandler.sendSuccess(res, 200, 'Payment Option disabled successfully!', {});
                });
            }
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to disable payment option');
        }
    },
    enablePaymentOption: (req, res, next) => {
        try {
            console.log('Req Body', req.body.active);
            if(req.body.active === undefined){
                respHandler.sendError(res, 400, 'FAILURE', 'Request cannot be completed due to malformed data!.');
            } else {
                PaymentOption.findByIdAndUpdate(req.params.id, {$set: {active: true}}, {new: true}, function (err, paymentOption) {
                    if (err) throw err;
                    respHandler.sendSuccess(res, 200, 'Payment Option enabled successfully!', {});
                });
            }
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to enable payment option');
        }
    }
};

module.exports = PaymentOptionController;

