const express = require('express');
const bodyParser = require('body-parser');
const validateService = require('../services/validateService');
const authentication = require('../controllers/Authentication');
const validator = require('express-validator/check');


const authRouter = express.Router();
authRouter.use(bodyParser.json());

authRouter.route('/')
    .all(function (req, res, next) {
        validateService.checkMethod(req, res, authentication.returnMessage, next, ['OPTIONS', 'GET', 'POST', 'PATCH', 'PUT', 'DELETE'], 'AUTHENTICATION')
    });
authRouter.route('/user')
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, authentication.startUser, next, ['OPTIONS', 'POST'], 'AUTHENTICATION')
    });
authRouter.route('/logout')
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, authentication.logoutUser, next, ['OPTIONS', 'POST'], 'AUTHENTICATION')
    });
authRouter.route('/password/email')
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, authentication.sendResendLink, next, ['OPTIONS', 'POST'], 'AUTHENTICATION')
    });
authRouter.route('/password/reset')
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, authentication.resetPassword, next, ['OPTIONS', 'POST'], 'AUTHENTICATION')
    });






module.exports = authRouter;


// User Control System