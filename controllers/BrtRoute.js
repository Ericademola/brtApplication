const BRTRoute = require('../models/brtRoutes');
const respHandler = require('../services/responseHandler');
const validate = require('../services/validateService');

const bcrypt = require('bcrypt');
const config = require('../config/constants');


const BrtRouteController = {
    returnMessage: function (req, res, next) {
        respHandler.sendSuccess(res, 200, 'Please specify the endpoint!', {});
    },
    listRoutes: (req, res, next) => {
        try {
            BRTRoute.find({}, function (err, routes) {
                if(err) throw  err;
                console.log('Routes ', routes);
                if (validate.resultFound(routes, res)){
                    const data = validate.formatData(routes);
                    respHandler.sendSuccess(res, 200, 'Routes listed successfully', data);
                }
            })
        } catch (err) {
            console.log('Error ', err);
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to list routes.', err);
        }
    },
    createRoute: (req, res, next) => {
        try {
            BRTRoute.findOne({$and: [{source: req.body.source}, {destination: req.body.destination}]}, function (err, data) {
                if (err) throw err;
                if(null === data){
                    BRTRoute.create(req.body, function (err, route) {
                        console.log('Route ', route);
                        if (err) {
                            respHandler.sendError(res, 400, 'FAILURE', err.message, err);
                        }
                        else if(validate.resultFound(route, res)) {
                            const data = validate.formatData(route);
                            respHandler.sendSuccess(res, 200, 'Route created successfully', data);
                        }
                    });
                } else {
                    respHandler.sendError(res, 403, 'FAILURE', 'Record already exist in the system, update instead.', err);
                }
            });
        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to create route');
        }
    },
    getRoute: (req, res, next) => {
        try {
            BRTRoute.findById(req.params.id, function (err, route) {
                if (err) throw err;
                if(validate.resultFound(route, res)) {
                    const data = validate.formatData(route);
                    respHandler.sendSuccess(res, 200, 'Route fetched successfully', data);
                }
            })
        } catch(err) {
            respHandler.sendError(res, 404, 'FAILURE', 'Unable to get route.', err);
        }
    },
    putRoute: (req, res, next) => {
        try {
            console.log('This is body ', req.body);
            BRTRoute.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function (err, route) {
                if (err) throw err;
                if(route) {
                    respHandler.sendSuccess(res, 200, 'Route updated successfully!', route);
                }
            });
        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to update route');
        }
    },
    patchRoute: (req, res, next) => {
        try {
            console.log('This is body ', req.body);
            BRTRoute.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function (err, route) {
                if (err) throw err;
                if(user) {
                    respHandler.sendSuccess(res, 200, 'Route patched successfully!', route);
                }
            });
        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to patch route');
        }
    },
    deleteRoute: (req, res, next) => {
        try {
            BRTRoute.findByIdAndDelete(req.params.id, function (err, route) {
                if (err) throw err;
                respHandler.sendSuccess(res, 200, 'Route deleted successfully!', {});
            });
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to delete route');
        }
    },
    deleteMultiple: (req, res, next) => {
       /* respHandler.sendError(res, 403, 'FAILURE', 'Forbidden, the action is not allowed!');
        return false;
        */try {
            BRTRoute.deleteMany({}, function (err, routes) {
                if (err) throw err;
                respHandler.sendSuccess(res, 200, 'All routes Deleted!', {});
            });
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to delete routes');
        }
    },
    searchRoute:  (req, res, next) => {
        console.log('Route Params 1 ', req.params, req.query);
        try {
            BRTRoute.findOne({$and: [{source: req.params.source}, {destination: req.params.destination}]}, function (err, route) {
                if(err) throw err;
                console.log('Data ', route)
                if(validate.resultFound(route, res)) {
                    const data = validate.formatData(route);
                    console.log('Type of ', typeof data);
                    // Return the `count` as the length of the data
                    if(typeof data === 'object' && data.length > 10 && req.query.count){
                        data.length = req.query.count;
                    }
                    respHandler.sendSuccess(res, 200, 'Matches found!', data);
                }
            });
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'No match found', err);
        }
    },
    searchRouteBySource:  (req, res, next) => {
        console.log('Route Params ', req.params, req.query);
        try {
            BRTRoute.find({source: req.params.source}, function (err, route) {
                if(err) throw err;
                console.log('Route ', route);
                if(validate.resultFound(route, res)) {
                    const data = validate.formatData(route);
                    // Return the `count` as the length of the data
                    if(typeof data === 'object' && data.length > 10 && req.query.count){
                        data.length = req.query.count;
                    }
                    respHandler.sendSuccess(res, 200, 'Matches found!', data);
                }
            });
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'No match found', err);
        }
    },
    searchRouteByDestination:  (req, res, next) => {
        console.log('Route Params ', req.params, req.query);
        try {
            BRTRoute.find({destination: req.params.destination}, function (err, route) {
                if(err) throw err;
                if(validate.resultFound(route, res)) {
                    const data = validate.formatData(route);
                    // Return the `count` as the length of the data
                    if(typeof data === 'object' && data.length > 10 && req.query.count){
                        data.length = req.query.count;
                    }
                    respHandler.sendSuccess(res, 200, 'Matches found!', data);
                }
            });
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'No match found', err);
        }
    },
    searchRouteByPrice:  (req, res, next) => {
        console.log('Route Params ', req.params, req.query);
        try {
            BRTRoute.find({price: req.params.price}, function (err, route) {
                if(err) throw err;
                if(validate.resultFound(route, res)) {
                    const data = validate.formatData(route);
                    // Return the `count` as the length of the data
                    if(typeof data === 'object' && data.length > 10 && req.query.count){
                        data.length = req.query.count;
                    }
                    respHandler.sendSuccess(res, 200, 'Matches found!', data);
                }
            });
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'No match found', err);
        }
    },
    searchRouteByCode:  (req, res, next) => {
        console.log('Route Params ', req.params, req.query);
        try {
            BRTRoute.find({code: req.params.code}, function (err, route) {
                if(err) throw err;
                if(validate.resultFound(route, res)) {
                    const data = validate.formatData(route);
                    // Return the `count` as the length of the data
                    if(typeof data === 'object' && data.length > 10 && req.query.count){
                        data.length = req.query.count;
                    }
                    respHandler.sendSuccess(res, 200, 'Matches found!', data);
                }
            });
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'No match found', err);
        }
    },
    searchRouteGeneral:  (req, res, next) => {
        console.log('Route Params ', req.params, req.query);
        try {
            BRTRoute.find({$or: [{source: req.params.source}, {destination: req.params.destination}]}, function (err, route) {
                if(err) throw err;
                if(validate.resultFound(route, res)) {
                    const data = validate.formatData(route);
                    // Return the `count` as the length of the data
                    if(typeof data === 'object' && data.length > 10 && req.query.count){
                        data.length = req.query.count;
                    }
                    respHandler.sendSuccess(res, 200, 'Matches found!', data);
                }
            });
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'No match found', err);
        }
    },
    getDestinationBySource:  (req, res, next) => {
        console.log('Route Params ', req.params, req.query);
        try {
            BRTRoute.find({source: req.params.source}, 'destination price _id', function (err, route) {
                if(err) throw err;
                if(validate.resultFound(route, res)) {
                    const data = validate.formatData(route);
                    // Return the `count` as the length of the data
                    if(typeof data === 'object' && data.length > 10 && req.query.count){
                        data.length = req.query.count;
                    }
                    respHandler.sendSuccess(res, 200, 'Matches found!', data);
                }
            });
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'No match found', err);
        }
    },
    listSources:  (req, res, next) => {
        console.log('Route Params ', req.params, req.query);
        try {
            BRTRoute.find({}, 'source _id', function (err, route) {
                if(err) throw err;
                if(validate.resultFound(route, res)) {
                    const data = validate.formatData(route);
                    // Return the `count` as the length of the data
                    if(typeof data === 'object' && data.length > 10 && req.query.count){
                        data.length = req.query.count;
                    }
                    respHandler.sendSuccess(res, 200, 'Matches found!', data);
                }
            });
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'No match found', err);
        }
    },
};

module.exports = BrtRouteController;

