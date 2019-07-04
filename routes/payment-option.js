const express = require('express');
const bodyParser = require('body-parser');
const validateService = require('../services/validateService');
const PaymentOption = require('../controllers/PaymentOption');
const validator = require('express-validator/check');


const paymentOptionRouter = express.Router();
paymentOptionRouter.use(bodyParser.json());

paymentOptionRouter.route('/')
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, PaymentOption.createPaymentOption, next, ['OPTIONS', 'POST'])
    })
    .get(function (req, res, next) {
        validateService.checkMethod(req, res, PaymentOption.getPaymentOptions, next, ['OPTIONS', 'GET'])
    });
paymentOptionRouter.route('/filter')
    .get(function (req, res, next) {
        validateService.checkMethod(req, res, PaymentOption.filterPaymentOption, next, ['OPTIONS', 'GET'])
    });
paymentOptionRouter.route('/:id')
    .get([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, PaymentOption.getPaymentOption, next, ['OPTIONS', 'GET'])
        }
    })
    .put([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, PaymentOption.updatePaymentOption, next, ['OPTIONS', 'PUT'])
        }
    })
    .patch([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, PaymentOption.updatePaymentOption, next, ['OPTIONS', 'PATCH'])
        }
    })
    .delete([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, PaymentOption.deletePaymentOption, next, ['OPTIONS', 'DELETE'])
        }
    });

paymentOptionRouter.route('/activate/:id')
    .post([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, PaymentOption.enablePaymentOption, next, ['OPTIONS', 'POST'])
        }
    });
paymentOptionRouter.route('/deactivate/:id')
    .post([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, PaymentOption.disablePaymentOption, next, ['OPTIONS', 'POST'])
        }
    });





module.exports = paymentOptionRouter;


// User Control System