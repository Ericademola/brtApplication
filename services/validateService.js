const respHandler = require('../services/responseHandler');
const controllerService = require('../services/controllerServices');
const validator = require('express-validator/check');

const validate = {
    /**
     * Check mongo Id
     * @param res
     * @param req
     * @returns {boolean}
     */

    validateObjectId: function (res, req){
        const errors = validator.validationResult(req);
        // check if there are errors
        if ( !errors.isEmpty() ) {
            respHandler.sendError(res, 422, 'FAILURE', 'Invalid reference Id');
            return false;
        }
        return true;
    },
    resultFound: function(user, res) {
        if (user){
            return true;
        }
        respHandler.sendError(res, 400, 'FAILURE', 'No data found');
        return false;
    },
    formatData: function (data) {
        if(!data){
            return null;
        }

        if(data){
            data.password = null;
        }
        return data;
    },
    checkMethod: function (req, res, callback, next, reqMethod, requirement = '') {
        const index = reqMethod.indexOf(req.method.toUpperCase());
        if (index > -1){
            (requirement === 'AUTHENTICATION') ? callback(req, res, next) : controllerService.checkAuthorizationToken(req, res, next, callback);
        }  else {
            // method not allowed 405
            const error =  new Error('Method not allowed');
            respHandler.sendError(res, 405, 'FAILURE', req.method.toUpperCase() + ' method is not allowed', error);
        }
    },
    checkMethodMvp: function (req, res, callback, next, reqMethod, routerReq = '') {
        const index = reqMethod.indexOf(req.method.toUpperCase());
        if (index > -1){
            if(routerReq === 'AUTHENTICATION'){
                callback(req, res, next);
            } else {
                controllerService.checkAuthorizationToken(req, res, next, callback)
            }
        } else {
            // method not allowed 405
            const error =  new Error('Method not allowed');
            respHandler.sendError(res, 405, 'FAILURE', req.method.toUpperCase() + ' method is not allowed', error);
        }
    },
    isEmptyObject: function (obj) {
        if(null === obj || obj === undefined){
            return true
        } else {
            return (Object.keys(obj).length === 0 && obj.constructor === Object)
        }
        // console.log('Invalid Obj ', (Object.keys(obj).length === 0 && obj.constructor === Object));
    }
};
module.exports = validate;


