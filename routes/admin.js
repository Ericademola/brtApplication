const express = require('express');
const bodyParser = require('body-parser');
const Admin = require('../controllers/Admin');
const validateService = require('../services/validateService');
const validator = require('express-validator/check');


const adminRouter = express.Router();
adminRouter.use(bodyParser.json());

adminRouter.route('/')
    .get(function (req, res, next) {
        validateService.checkMethod(req, res, Admin.getAdmins, next, ['OPTIONS', 'GET'])
    })
  .post(function (req, res, next) {
        validateService.checkMethod(req, res, Admin.createAdmin, next, ['OPTIONS', 'POST'])
    });

adminRouter.route('/:id')
    .get([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Admin.getAdmin, next, ['OPTIONS', 'GET'])
        }
    })
    .put([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Admin.putAdmin, next, ['OPTIONS', 'PUT'])
        }
    })
    .patch([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Admin.patchAdmin, next, ['OPTIONS', 'PATCH'])
        }
    })
    .delete([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Admin.deleteAdmin, next, ['OPTIONS', 'DELETE'])
        }
    });
adminRouter.route('/delete-multiple')
    .delete(function (req, res, next) {
        validateService.checkMethod(req, res, Admin.deleteMultiple, next, ['OPTIONS', 'DELETE'])
    });
adminRouter.route('/:id/password/change')
    .post([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Admin.changePassword, next, ['OPTIONS', 'POST'])
        }
    });
adminRouter.route('/:id/avatar')
    .post([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Admin.createAdminAvatar, next, ['OPTIONS', 'POST'])
        }
    })
    .delete([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Admin.deleteAdminAvatar, next, ['OPTIONS', 'DELETE'])
        }
    });

adminRouter.route('/:id/permissions/add')
    .post([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Admin.addAdminPermission, next, ['OPTIONS', 'POST'])
        }
    });
adminRouter.route('/:id/permissions/remove')
    .post([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, Admin.removeAdminPermission, next, ['OPTIONS', 'POST'])
        }
    });

module.exports = adminRouter;


// User Control System