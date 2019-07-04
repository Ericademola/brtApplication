const Transaction = require('../models/Transactions');
const WalletTransaction = require('../models/walletTransaction');
const Ticket = require('../models/Tickets');
const Wallet = require('../models/wallet');
const OTP = require('../models/OTP');
const WalletValue = require('../models/walletValue');
const PaymentOption = require('../models/paymentOption');
const BrtRoute = require('../models/brtRoutes');
const respHandler = require('../services/responseHandler');
const validate = require('../services/validateService');
const validator = require('express-validator/check');
const nanoid = require('nanoid');
const jwt = require('jsonwebtoken');
const config = require('../config/constants');
const bwipjs = require('bwip-js');
const moment = require('moment');
const fetch = require('node-fetch');


const TransactionController = {
    returnMessage: function (req, res, next) {
        respHandler.sendSuccess(res, 200, 'Please specify the endpoint!', {});
    },
    createTransaction: (req, res, next) => {
        try {
            Transaction.findOne({name: req.body.name}, function (err, data) {
                if (err) throw err;
                if(null === data){
                    Transaction.create(req.body, function (err, paymentOption) {
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
    listTransactions: (req, res, next) => {
        try {
            Transaction.find({}).populate('userId').exec(
                function (err, transaction) {
                    if(err) throw  err;
                    console.log('Transactions ', transaction);
                    if (validate.resultFound(transaction, res)){
                        const data = validate.formatData(transaction);
                        respHandler.sendSuccess(res, 200, 'Transactions listed successfully', data);
                    }
                }
            )
        } catch (err) {
            console.log('Error ', err);
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to list transactions.', err);
        }
    },
    filterTransaction: (req, res, next) => {
        try {
            console.log('Transaction body', req.body);
            if(!validate.isEmptyObject(req.body)){
                console.log('Hello world');
                Transaction.find(req.body, function (err, transactions) {
                    if(err) throw  err;
                    console.log('paymentOptions ', transactions);
                    if (validate.resultFound(transactions, res)){
                        const data = validate.formatData(transactions);
                        respHandler.sendSuccess(res, 200, `Transactions listed successfully`, data);
                    }
                })
            } else {
                Transaction.find({})
                    .exec( function (err, transactions) {
                    if(err) throw  err;
                    console.log('Tramsactions ', transactions);
                    if (validate.resultFound(transactions, res)){
                        const data = validate.formatData(transactions);
                        respHandler.sendSuccess(res, 200, 'Transactions record listed successfully', data);
                    }
                })
            }
        } catch (err) {
            console.log('Error ', err);
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to list transactions.', err);
        }
    },
    getTransaction: (req, res, next) => {
        try {
            Transaction.findById(req.params.id, function (err, transaction) {
                if(err) throw  err;
                console.log('Transaction ', transaction);
                if (validate.resultFound(transaction, res)){
                    const data = validate.formatData(transaction);
                    respHandler.sendSuccess(res, 200, 'Transaction listed successfully', data);
                }
            })
        } catch (err) {
            console.log('Error ', err);
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to get transaction.', err);
        }
    },
    updateTransaction: (req, res, next) => {
        try {
            console.log('This is body ', req.body);
            Transaction.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function (err, transaction) {
                if (err) throw err;
                if(transaction) {
                    respHandler.sendSuccess(res, 200, 'Payment Option updated successfully!', transaction);
                }
            });
        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to update transaction');
        }
    },
    deleteTransaction: (req, res, next) => {
        try {
            Transaction.deleteOne(req.params.id, function (err, transaction) {
                if (err) throw err;
                respHandler.sendSuccess(res, 200, 'Transaction deleted successfully!', {});
            });
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to delete transaction');
        }
    },
    verifyOTP: (req, res, next) => {
        try {
            const auth = req.headers.authorization;
            const user = jwt.verify(auth, config.SECRETENTITY);
            OTP.findOne({$and: [{transactionRef: req.body.transactionRef}, {userId: user._id}]}, function (err, otp) {
                if (err) throw err;
                console.log('OTP', otp);
               if(!validate.isEmptyObject(otp) && (otp.otp == req.body.oneTimePassword)) {
                   //                   respHandler.sendSuccess(res, 200, 'OTP is valid', {});
                   console.log('Hello world');
                   sendBarCode(req.body.ticketId, req, res, next);
               } else {
                   respHandler.sendError(res, 400, 'FAILURE', 'Invalid OTP');
               }
            });
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to verify transaction');
        }
    },
    resendOTP: (req, res, next) => {
        try {
            //  Todo: Trigger Token;
            respHandler.sendSuccess(res, 200, 'Token has been resent', {});
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to delete transaction');
        }
    },
    payUsingBank: (req, res, next) => {
        try {
            // Todo: Expected input
            const body = {
                bankCode: 343,
                bankName: '',
                bankAccount: '',
                accountNumber: '',
                transactionRef: '',
                transactionId: ''
            };

            try {
                const auth = req.headers.authorization;
                const user = jwt.verify(auth, config.SECRETENTITY);
                Transaction.findById(req.body.transactionId, function (err, trans) {
                    if(err) throw err;
                    if(!validate.isEmptyObject(trans)){
                        const otp = {
                            transactionId: req.body.transactionId,
                            userId: user._id,
                            transactionRef: req.body.transactionRef,
                            otp: '908667'

                        };
                       try {
                           OTP.create(otp, function (err, otp_) {
                               if(err) throw err;
                               if(otp_) {
                                   respHandler.sendSuccess(res, 200, 'OTP is generated.', otp);
                               }
                           });
                       } catch (err){
                           respHandler.sendError(res, 400, 'FAILURE', 'OTP is required', err);
                       }
                    } else {
                        respHandler.sendError(res, 400, 'FAILURE', 'Invalid transaction id');
                    }
                })
            } catch(err) {

            }
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to complete transaction');
        }
    },
    getAccountName: (req, res, next) => {
        try {
            //todo:  expected input
            if(req.body.bankCode == '343' && (req.body.bankName).toLowerCase() === 'first bank' && req.body.accountNumber === '0123456789'){
                respHandler.sendSuccess(res, 200, 'Account Name retrieved', {
                    name: 'John Julius',
                    bankCode: '343',
                    bankName: 'First Bank',
                    accountNumber: '0123456789'});
            } else {
                respHandler.sendError(res, 404, 'FAILURE', 'Invalid account details', req.body);
            }


            /*Transaction.deleteOne(req.params.id, function (err, transaction) {
                if (err) throw err;
                respHandler.sendSuccess(res, 200, 'Transaction deleted successfully!', {});
            });*/
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to retrieve account name!', err);
        }
    },
    buyTicket: (req, res, next) => {
        try {
            console.log('This is body ', req.body);
            const ticketObject = req.body;
            const auth = req.headers.authorization;
            const decodedUser = jwt.verify(auth, config.SECRETENTITY);

            // console.log('Auth : ', decodedUser);
            ticketObject.userId = decodedUser._id;
            console.log('Ticket Information : ', ticketObject);
            try {
                PaymentOption.findById(req.body.paymentOptionId, function (error_, found) {
                    if(error_) throw error_;
                    if(!validate.isEmptyObject(found)) {
                        try {
                            let walletValue = 0;
                            Wallet.findOne({userId: decodedUser._id}, function (err, wallet) {
                                if(err) throw err;
                                if(wallet){

                                    WalletValue.findById(wallet._id, function (err, value) {
                                        if(err) throw err;
                                        if(value){
                                          walletValue = value.amount;
                                        }
                                    })
                                }
                            });
                                BrtRoute.findById(req.body.routeId, function (err, route) {
                                    if(err) throw err;
                                    if(!validate.isEmptyObject(route)){
                                        const date = new Date();
                                        const ref = '00'+ nanoid() + '-' + date.getTime().toString().slice(0, 5) + '-' + date.getFullYear().toString().substr(-2); // length must be 32
                                        const responseData = {
                                            transactionRef: ref,
                                            transactionId: null,
                                            paymentOptionSelected: found.name,
                                            USSDCode: null,
                                            amountToPay: route.price,
                                            currency: route.currency
                                        };
                                        ticketObject.transactionRef = responseData.transactionRef;
                                        Ticket.create(ticketObject, function (err, ticket) {
                                            if (err) throw err;
                                            if(!validate.isEmptyObject(ticket)) {
                                                // todo: data: ticket this is the information to perform ticket operation
                                                const transObj = {
                                                   userId:  ticketObject.userId,
                                                    transRef: responseData.transactionRef,
                                                    amount: route.price,
                                                    walletBalBeforeTrans: (walletValue == 0)? null : walletValue,
                                                    transactionType: 'Paid_out_of_account',
                                                    transactionPurpose: 'BUY_TICKET',
                                                    status: 'pending',
                                                    routeInfo: route._id,
                                                    paymentOptionInfo: found._id,
                                                    routeCode: route.code
                                                };
                                                Transaction.create(transObj, function (error, transaction) {
                                                    if(error) throw error;
                                                    if(!validate.isEmptyObject(transaction)) {
                                                        transObj.transId = responseData.transactionId = transaction._id;
                                                        transObj.ticketId = responseData.ticketId= ticket._id;
                                                        processPaymentAction(transObj, responseData, req, res, next);
                                                    }
                                                    });
                                            }
                                        });
                                    }
                                })
                        } catch (error) {
                            respHandler.sendError(res, 400, 'FAILURE', 'Route id is not found on this server.');
                        }
                    }
                })
            } catch (error){
                respHandler.sendError(res, 400, 'FAILURE', 'Payment option id is not found on this server.');
            }
        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to create ticket reference');
        }
    },
    listTickets: (req, res, next) => {
        try {
            Ticket.find({})
                .exec(function (err, tickets) {
                    if (err) throw err;
                    if(tickets) {
                        respHandler.sendSuccess(res, 200, 'All tickets listed', tickets);
                    }
                });
        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to list tickets');
        }
    },
    listBanks: (req, res, next) => {
        try {
         const  banks = [
             {name: 'First Bank', code: 343},
             {name: 'Sterling Bank', code: 373},
             {name: 'Polaris Bank', code: 473},
             {name: 'Union Bank', code: 474},
             {name: 'Unity Bank', code: 472},
             {name: 'Guaranty Trust Bank', code: 672},
             {name: 'UBA', code: 572}
         ];
            // getBankNibbs(req, res, next);
            respHandler.sendSuccess(res, 200, 'Available bank listed successfully', banks);

        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to list banks');
        }
    },
    getTicket: (req, res, next) => {
        try {
            Ticket.findById(req.params.id)
                .populate('userId')
                .populate('paymentOptionId')
                .populate('routeId')
                .exec(function (err, ticket) {
                    if (err) throw err;
                    if(ticket) {
                        respHandler.sendSuccess(res, 200, 'Tickets fetched successfully', ticket);
                    }
                });
        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to get ticket');
        }
    },
    listUserTicket: (req, res, next) => {
        try {
            Ticket.find({$and: [{userId: req.params.userId}, {barcode: {$gt: '000000' } } ]})
                .populate()
                .exec(function (err, tickets) {
                    if (err) throw err;
                    if(tickets) {
                        respHandler.sendSuccess(res, 200, 'Tickets fetched successfully', tickets);
                    }
                });
        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to list user tickets');
        }
    },
    updateTicket: (req, res, next) => {
        try {
            console.log('This is body ', req.body);
            respHandler.sendError(res, 403, 'FAILURE', 'Update to a generated ticket not allowed');

            /*  Ticket.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function (err, transaction) {
                  if (err) throw err;
                  if(transaction) {
                      respHandler.sendSuccess(res, 200, 'Ticket updated successfully!', transaction);
                  }
              });*/
        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to update ticket');
        }
    },
    deleteTicket: (req, res, next) => {
        try {
            console.log('This is body ', req.body);
            respHandler.sendError(res, 400, 'FAILURE', 'Ticket cannot be deleted!');
            /*
                        Ticket.findByIdAndDelete(req.params.id, function (err, ticket) {
                            if (err) throw err;
                            if(ticket) {
                                respHandler.sendSuccess(res, 200, 'Ticket deleted successfully!', ticket);
                            }
                        });*/
        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to delete ticket');
        }
    },
    destroyTicket: (req, res, next) => {
        respHandler.sendError(res, 403, 'FAILURE', 'Api in construction');

        /* try {
             console.log('This is body ', req.body);
             Ticket.findByIdAndUpdate(req.params.id, {$set: {isValid: false, destroyed: true}}, {new: true}, function (err, ticket) {
                 if (err) throw err;
                 if(ticket) {
                     respHandler.sendSuccess(res, 200, 'Ticket has been destroyed', ticket);
                 }
             });
         } catch (err){
             respHandler.sendError(res, 400, 'FAILURE', 'Unable to destroy  this ticket');
         }*/
    }
};

module.exports = TransactionController;

 function generateBarcode(value) {
     return new Promise(function (resolve, reject) {
         bwipjs.toBuffer({
             bcid:        'code128',       // Barcode type
             text:        value,            // Text to encode
             scale:       3,               // 3x scaling factor
             height:      10,              // Bar height, in millimeters
             includetext: true,            // Show human-readable text
             textxalign:  'center',        // Always good to set this
         }, function (err, png) {
             if (err) {
                 // Decide how to handle the error
                 // `err` may be a string or Error object
                 reject(err);
             } else {
                 resolve('data:image/png;base64,' + png.toString('base64'));
                 // `png` is a Buffer
                 // png.length           : PNG file length
                 // png.readUInt32BE(16) : PNG image width
                 // png.readUInt32BE(20) : PNG image height
             }
         });
     });

}
function processPaymentAction(transProperty, responseData, req, res, next) {
try {
    const paymentOptionId = transProperty.paymentOptionInfo;
    PaymentOption.findOne({_id: paymentOptionId}, function (err, paymentOption) {
        if(err) throw err;
        if(!validate.isEmptyObject(paymentOption)){
            switch(paymentOption.name) {
                case 'USSD': {
                    payWithUssd(transProperty, responseData, req, res, next);
                    break;
                }
                case 'BANK ACCOUNT': {
                    respHandler.sendSuccess(res, 200, 'Ticket reference created, proceed to pay', responseData);
                    break;
                }
                case 'DEBIT CARD': {
                    payWithDebitCard(transProperty, responseData, req, res, next);
                    break;
                }
                case 'WALLET': {
                    payWithWallet(transProperty, responseData, req, res, next);
                    break;
                }
                default: {
                    reportTransactionStatus('failed', transProperty);
                    respHandler.sendError(res, 400, 'FAILURE', 'Payment method not recognised');
                }
            }
        }
    })
} catch (error) {
    respHandler.sendError(res, 400, 'FAILURE', 'Unable to process this transaction');
}
}
function payWithBankAccount(transProperty, callback, req, res, next) {
// TODO: Pay with bank account.
}
function payWithUssd(transProperty, responseData, req, res, next) {
     const code = config.BASE_CODE + config.PRODUCT_CODE + transProperty.routeCode + '#';
     responseData.USSDCode = code;
    respHandler.sendSuccess(res, 200, 'Ticket reference created, proceed to pay', responseData);

}
function payWithWallet(transProperty, responseData, req, res, next) {
     const user = jwt.verify(req.headers.authorization, config.SECRETENTITY);
    Wallet.findOne({userId: user._id}, function (err, wallet) {
        if(err) throw err;
        if(wallet && !validate.isEmptyObject(wallet)){
            WalletValue.findById(wallet._id, function (err, value) {
                if(err) throw err;
                if(!validate.isEmptyObject(value)){
                    const walletValue = value.amount;
                    if(Math.sign(parseInt(walletValue, 10)) === -1){
                        respHandler.sendError(res, 406, 'FAILURE', 'Wallet value is currently negative, please fund your wallet!');
                    } else if (parseInt(transProperty.amount, 10) < parseInt(walletValue, 10)) {
                        respHandler.sendError(res, 406, 'FAILURE', 'Insufficient amount in wallet, please fund wallet.');
                    } else {
                        const newWalletAmount = (parseInt(walletValue, 10) - parseInt(transProperty.amount, 10));
                        try {
                            WalletValue.findByIdAndUpdate(wallet._id, {$set: {amount: newWalletAmount, digit: newWalletAmount}}, {new: true}, function (err, wallet) {
                                if(err) throw err;
                                updateTransactionTable(transProperty, newWalletAmount);
                            })
                        } catch (err) {
                            console.log('Error occurred while updating wallet'); // Todo: Log this error in a file
                            WalletValue.findByIdAndUpdate(wallet._id, {$set: {amount: newWalletAmount, digit: newWalletAmount}}, {new: true}, function (err, wallet) {
                                updateTransactionTable(transProperty, newWalletAmount);
                            });
                        }
                            function updateTransactionTable(transProperty, newWalletAmount) {
                                try {
                                    Transaction.findByIdAndUpdate(transProperty.transId, {$set: {walletBalAfterTrans: newWalletAmount,
                                        amount: transProperty.amount,
                                        status: 'completed'}}, {new: true}, function (err, transaction) {
                                        updateWalletTransactionTable(transProperty, parseInt(transProperty.amount, 10));
                                    });
                                } catch(err) {
                                    updateWalletTransactionTable(transProperty, parseInt(transProperty.amount, 10));
                                }
                                }
                             function updateWalletTransactionTable(transProperty, amount) {
                                try {
                                    WalletTransaction.create({userId: transProperty.userId,
                                        walletId: wallet._id,
                                        amount: amount,
                                        transactionId: transProperty.transId,
                                        transactionType: 'Paid_out'}).populate('userId')
                                        .populate('walletId')
                                        .populate('transactionId')
                                        .exec(function (err, walletTransaction) {
                                          sendBarCode(transProperty, req, res, next);
                                        });
                                } catch(err) {}
                                }


                    }
                } else {
                    reportTransactionStatus('failed', transProperty);
                    respHandler.sendError(res, 406, 'FAILURE', 'User has no wallet');
                }
            })
        } else {
            reportTransactionStatus('failed', transProperty);
            respHandler.sendError(res, 406, 'FAILURE', 'User has no wallet');
        }
    });
}
function payWithDebitCard(transProperty, callback, req, res, next) {
    respHandler.sendError(res, 400, 'This api is not implemented yet', {});
}
function getBankNibbs(req, res, next) {
    fetch('http://staging.nibss-plc.com.ng/CentralPayWebservice/CentralPayOperations?wsdl', {method: 'GET'})
        .then(res_ => {res_.json();
            console.log('Central pay success', res_);

        }, error => {
            console.log('R Error 4', error);



            // reportTransactionStatus('failed', transProperty);
            respHandler.sendError(res, 401, 'FAILURE', 'Unable to list banks');
        }).catch(function (error) {
        console.log('Error Bank', error);
        respHandler.sendError(res, 401, 'FAILURE', 'Unable to list banks 3');
    })
}
function reportTransactionStatus(status, transProperty) {
    console.log('Transaction status');
    Transaction.findByIdAndUpdate(transProperty.transId, {$set: {status: status}}, {new: true}, function (err, transaction) {
        if(status === 'failed') {
        Ticket.findByIdAndUpdate(transProperty.ticketId, {$set: {isValid: false}}, {new: true}, function (err, ticket) {

            });
        }
    });
}


let recordKeeper = false;
function sendBarCode(data, req, res, next) {
    const codeGlobal = getRandom();

    //{generatedDate: {$ne: moment(Date.now())}
    Ticket.find({barcode: codeGlobal}, (err, tickets) => {
        console.log('Ticket is here');
        if((null !== tickets || tickets !== undefined) && tickets.length > 0){
            console.log('Ticket is here 3');

            tickets.forEach((ticket) => {
                if(ticket.isExpired) {
                    const code = '!' + ticket.barcode;
                    updateTicket(ticket, {barcode: code});
                } else if((moment(ticket.expiredIn)).isSameOrAfter(moment(Date.now()))) {
                    updateTicket(ticket, {barcode: code, expired: true});
                } else if(!ticket.isValid || ticket.destroy) {
                    updateTicket(ticket, {barcode: code});
                } else {
                    console.log('Ticket is here 5');
                    recordKeeper = true;
                }
            });
            if(recordKeeper) {
                recordKeeper = !recordKeeper;
                console.log('Ticket is here 7');

                sendBarCode(data, req, res, next);
            } else {
                console.log('Hung up');
            }

        } else {
           try {
               Ticket.findByIdAndUpdate(data, {$set: {barcode: codeGlobal, expiredIn: moment(Date.now()).add(24, 'hours')}}, {new: true}, function (err, done) {
                    if(err) throw err;
                   console.log('Ticket is here 88', done);

                   if(!validate.isEmptyObject(done)) {
                       console.log('Ticket is here 87r');

                       forwardCode(codeGlobal);
                    } else {
                       respHandler.sendError(res, 400, 'FAILURE', 'No ticket found for this transaction', err);
                   }
               });
           } catch (err){
               respHandler.sendError(res, 400, 'FAILURE', 'Unable to save barcode', err);
           }
        }
        function updateTicket(ticket, value) {
            Ticket.findByIdAndUpdate(ticket._id, {$set: value}, {new: true}, function (err, done) {

            });
        }
    });
   function forwardCode(code) {
       const barcodeGenerator = generateBarcode(code);
       console.log('Ticket is here 3322');

       barcodeGenerator.then(function (result) {
           console.log(result);
           respHandler.sendSuccess(res, 200, 'Barcode successfully!', {barcode: result, code: code});
       }, function (error) {
           respHandler.sendError(res, 401, 'FAILURE', 'Unable to generate barcode', {code: code, error: error});
       });
   }
}

function getRandom() {
     let code = '';
    const rand = Math.floor(Math.random() * 999999);
    const randLength = rand.toString().split('');
    for(let i=0; i < 6; i++) {
        const extra = Math.floor(Math.random() * 9);
        code += randLength[i] || extra;
    }
    const date = new Date();
    const minutes = date.getMinutes();
    (minutes % 2 === 1) ? code = code.split('').reverse().join('') : code;
    return code;
}