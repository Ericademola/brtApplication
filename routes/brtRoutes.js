const express = require('express');
const validateService = require('../services/validateService');
const BRTRoutes = require('../controllers/BrtRoute');
const validator = require('express-validator/check');

const brtRouteRouter = express.Router();

/* GET users listing. */
brtRouteRouter.route('/')
    .get(function (req, res, next) {
        validateService.checkMethod(req, res, BRTRoutes.listRoutes, next, ['OPTIONS', 'GET'])
    })
    .post(function (req, res, next) {
        validateService.checkMethod(req, res, BRTRoutes.createRoute, next, ['OPTIONS', 'POST'])
    })
    .delete(function (req, res, next) {
        validateService.checkMethod(req, res, BRTRoutes.deleteMultiple, next, ['OPTIONS', 'DELETE'])
    });
brtRouteRouter.route('/:id')
    .get([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, BRTRoutes.getRoute, next, ['OPTIONS', 'GET'])
        }
    })
    .put([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, BRTRoutes.putRoute, next, ['OPTIONS', 'PUT'])
        }
    })
    .patch([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, BRTRoutes.patchRoute, next, ['OPTIONS', 'PATCH'])
        }
    })
    .delete([validator.param('id').isMongoId().trim()], function (req, res, next) {
        if(validateService.validateObjectId(res, req)) {
            validateService.checkMethod(req, res, BRTRoutes.deleteRoute, next, ['OPTIONS', 'DELETE'])
        }
    });
brtRouteRouter.route('/delete-multiple')
    .delete(function (req, res, next) {
        validateService.checkMethod(req, res, BRTRoutes.deleteMultiple, next, ['OPTIONS', 'DELETE'])
    });
brtRouteRouter.route('/search/:source-:destination')
    .get(function (req, res, next) {
        validateService.checkMethod(req, res, BRTRoutes.searchRoute, next, ['OPTIONS', 'GET'])
    });
brtRouteRouter.route('/search/source/:source')
    .get(function (req, res, next) {
        validateService.checkMethod(req, res, BRTRoutes.searchRouteBySource, next, ['OPTIONS', 'GET'])
    });
brtRouteRouter.route('/search/destination/:destination')
    .get(function (req, res, next) {
        validateService.checkMethod(req, res, BRTRoutes.searchRouteByDestination, next, ['OPTIONS', 'GET'])
    });
brtRouteRouter.route('/search/:source-:destination/general')
    .get(function (req, res, next) {
        validateService.checkMethod(req, res, BRTRoutes.searchRouteGeneral, next, ['OPTIONS', 'GET'])
    });

brtRouteRouter.route('/search/price/:price')
    .get(function (req, res, next) {
        validateService.checkMethod(req, res, BRTRoutes.searchRouteByPrice, next, ['OPTIONS', 'GET'])
    });
brtRouteRouter.route('/search/code/:code')
    .get(function (req, res, next) {
        validateService.checkMethod(req, res, BRTRoutes.searchRouteByCode, next, ['OPTIONS', 'GET'])
    });
brtRouteRouter.route('/search/getSource')
    .get(function (req, res, next) {
        validateService.checkMethod(req, res, BRTRoutes.listSources, next, ['OPTIONS', 'GET'])
    });
brtRouteRouter.route('/search/getDestinations/:source')
    .get(function (req, res, next) {
        validateService.checkMethod(req, res, BRTRoutes.getDestinationBySource, next, ['OPTIONS', 'GET'])
    });


module.exports = brtRouteRouter;
