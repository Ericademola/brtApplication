const express = require('express');
const bodyParser = require('body-parser');
const validateService = require('../services/validateService');
const Wallet = require('../controllers/Wallet');
const validator = require('express-validator/check');


const walletRouter = express.Router();
walletRouter.use(bodyParser.json());

walletRouter.route('/')
    .all(function (req, res, next) {
        validateService.checkMethod(req, res, Wallet.returnMessage, next, ['OPTIONS', 'GET', 'POST', 'PATCH', 'PUT', 'DELETE'])
    });
walletRouter.route('/balance')
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, Wallet.walletBalance, next, ['OPTIONS', 'POST'])
    });
walletRouter.route('/create')
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, Wallet.createWallet, next, ['OPTIONS', 'POST'])
    });
walletRouter.route('/disable/account')
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, Wallet.disableWallet, next, ['OPTIONS', 'POST'])
    });
walletRouter.route('/enable/account')
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, Wallet.enableWallet, next, ['OPTIONS', 'POST'])
    });
walletRouter.route('/fund')
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, Wallet.fundWallet, next, ['OPTIONS', 'POST'])
    });





module.exports = walletRouter;


// User Control System