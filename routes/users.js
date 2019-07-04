const express = require('express');
const validateService = require('../services/validateService');
const users = require('../controllers/Users');
const validator = require('express-validator/check');
const userRouter = express.Router();

/* GET users listing. */
userRouter.route('/')
    .get(function (req, res, next) {
        validateService.checkMethod(req, res, users.getUsers, next, ['OPTIONS', 'GET'])
    })
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, users.storeUser, next, ['OPTIONS', 'POST'])
    });
userRouter.route('/:id')
    .get([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, users.getUser, next, ['OPTIONS', 'GET'])
        }
    })
    .put([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, users.putUser, next, ['OPTIONS', 'PUT'])
        }
    })
    .patch([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, users.patchUser, next, ['OPTIONS', 'PATCH'])
        }
    })
    .delete([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, users.deleteUser, next, ['OPTIONS', 'PUT'])
        }
    });
userRouter.route('/delete-multiple')
    .delete(function (req, res, next) {
        validateService.checkMethod(req, res, users.deleteMultiple, next, ['OPTIONS', 'DELETE'])
    });
userRouter.route('/:id/password/change')
    .post([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, users.changePassword, next, ['OPTIONS', 'POST'])
        }
    });
userRouter.route('/:id/avatar')
    .post([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, users.createUserAvatar, next, ['OPTIONS', 'POST'])
        }
    })
    .delete([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, users.deleteUserAvatar, next, ['OPTIONS', 'DELETE'])
        }
    });


module.exports = userRouter;
