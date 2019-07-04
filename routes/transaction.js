const express = require('express');
const bodyParser = require('body-parser');
const validateService = require('../services/validateService');
const Transaction = require('../controllers/Transaction');
const validator = require('express-validator/check');


const transactionRouter = express.Router();
transactionRouter.use(bodyParser.json());

transactionRouter.route('/')
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, Transaction.createTransaction, next, ['OPTIONS', 'POST'])
    })
    .get(function (req, res, next) {
        validateService.checkMethod(req, res, Transaction.listTransactions, next, ['OPTIONS', 'GET'])
    });
transactionRouter.route('/filter')
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, Transaction.filterTransaction, next, ['OPTIONS', 'POST'])
    });
transactionRouter.route('/:id')
    .get([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Transaction.getTransaction, next, ['OPTIONS', 'GET'])
        }
    })
    .put([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Transaction.updateTransaction, next, ['OPTIONS', 'PUT'])
        }
    })
    .patch([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Transaction.updateTransaction, next, ['OPTIONS', 'PATCH'])
        }
    })
    .delete([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Transaction.deleteTransaction(), next, ['OPTIONS', 'DELETE'])
        }
    });
transactionRouter.route('/ticket')
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, Transaction.buyTicket, next, ['OPTIONS', 'POST'])
    });
transactionRouter.route('/ticket/get')
    .get(function (req, res, next) {
        validateService.checkMethod(req, res, Transaction.listTickets, next, ['OPTIONS', 'GET'])
    });
transactionRouter.route('/banks/list')
    .get(function (req, res, next) {
        validateService.checkMethod(req, res, Transaction.listBanks, next, ['OPTIONS', 'GET'])
    });
transactionRouter.route('/user/:userId/tickets')
    .get([validator.param('userId').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Transaction.listUserTicket, next, ['OPTIONS', 'GET'])
        }
    });
transactionRouter.route('/ticket/:id')
    .get([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Transaction.getTicket, next, ['OPTIONS', 'GET'])
        }
    })
    .put([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Transaction.updateTicket, next, ['OPTIONS', 'PUT'])
        }
    })
    .patch([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Transaction.updateTicket, next, ['OPTIONS', 'PATCH'])
        }
    })
    .delete([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Transaction.deleteTicket, next, ['OPTIONS', 'DELETE'])
        }
    });
transactionRouter.route('/otp/confirm')
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, Transaction.verifyOTP, next, ['OPTIONS', 'POST'])
    });
transactionRouter.route('/resend/otp')
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, Transaction.resendOTP, next, ['OPTIONS', 'POST'])
    });
transactionRouter.route('/payWithBank')
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, Transaction.payUsingBank, next, ['OPTIONS', 'POST'])
    });
transactionRouter.route('/getAccountName')
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, Transaction.getAccountName, next, ['OPTIONS', 'POST'])
    });
transactionRouter.route('/ticket/destroy/:id')
    .post([validator.param('id').isMongoId().trim()], function (req, res, next) { // reasons for destruction
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Transaction.destroyTicket, next, ['OPTIONS', 'POST'])
        }
    });
transactionRouter.route('/ticket/status/:id')
    .get([validator.param('id').isMongoId().trim()], function (req, res, next) { // owner info, expired status etc
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Transaction.getTicket, next, ['OPTIONS', 'GET'])
        }
    });








module.exports = transactionRouter;


// User Control System