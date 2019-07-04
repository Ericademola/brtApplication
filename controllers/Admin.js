const Admin = require('../models/admin');
const respHandler = require('../services/responseHandler');
const validate = require('../services/validateService');

const bcrypt = require('bcrypt');
const config = require('../config/constants');
const mailJet = require('../mailSystem/mailSystem');


const AdminController = {
    returnMessage: function (req, res, next) {
        respHandler.sendSuccess(res, 200, 'Please specify the endpoint!', {});
    },
    getAdmins: (req, res, next) => {
        try {
            Admin.find({}, '_id username confirmedUser createdAt email name avatar_url gender country permission', function (err, admin) {
                if(err) throw  err;
                console.log('Admin ', admin);
                if (validate.resultFound(admin, res)){
                    const data = validate.formatData(admin);
                    respHandler.sendSuccess(res, 200, 'Admin listed successfully', data);
                }
            })
        } catch (err) {
            console.log('Error ', err);
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to list admin.', err);
        }
    },
    createAdmin: (req, res, next) => {
        try {
            const userObject = req.body;
            console.log('User Object ', req.body);
            bcrypt.hash(req.body.password, 10,  (err, hash) => {
                userObject.password = hash;
                console.log('User Object 2', userObject);

                Admin.create(userObject, function (err, admin) {
                    console.log('User ', admin);
                    if (err) {
                        console.log('err.name' , err.name);
                        switch (err.name) {
                            case 'ValidationError': {
                                let errorMsg = err.message;
                                if (err.message.includes('`username` to be unique')){
                                    errorMsg = 'Username has been used already!';
                                }
                                respHandler.sendError(res, 406, 'FAILURE', errorMsg, err);
                                break;
                            }
                            default: {
                                respHandler.sendError(res, 400, 'FAILURE', err.message, err);
                                break;
                            }
                        }
                        // respHandler.sendError(res, 406, 'FAILURE', 'Error While Creating Site', err);
                        return false;
                    }
                    else if(validate.resultFound(admin, res)) {
                        const data = validate.formatData(admin);
                        respHandler.sendSuccess(res, 200, 'Admin created successfully', data);
                    }
                });
            });

        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to create admin');
        }
    },
    getAdmin: (req, res, next) => {
        try {
            Admin.findById(req.params.id, function (err, admin) {
                if (err) throw err;
                if(validate.resultFound(admin, res)) {
                    const data = validate.formatData(admin);
                    respHandler.sendSuccess(res, 200, 'Admin fetched successfully', data);
                }
            })
        } catch(err) {
            respHandler.sendError(res, 404, 'FAILURE', 'Unable to get user.', err);
        }
    },
    putAdmin: (req, res, next) => {
        try {
            console.log('This is body ', req.body);
            Admin.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function (err, user) {
                if (err) throw err;
                if(user) {
                    user.password = null;
                    respHandler.sendSuccess(res, 200, 'Admin updated successfully!', user);
                }
            });
        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to update user');
        }
    },
    patchAdmin: (req, res, next) => {
        try {
            console.log('This is body ', req.body);
            Admin.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function (err, user) {
                if (err) throw err;
                if(user) {
                    user.password = null;
                    respHandler.sendSuccess(res, 200, 'Admin patched successfully!', user);
                }
            });
        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to patch user');
        }
    },
    deleteAdmin: (req, res, next) => {
        try {
            Admin.findByIdAndDelete(req.params.id, function (err, admin) {
                if (err) throw err;
                respHandler.sendSuccess(res, 200, 'Admin deleted successfully!', {});
            });
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to delete admin');
        }
    },
    deleteMultiple: (req, res, next) => {
        respHandler.sendError(res, 403, 'FAILURE', 'Forbidden, the action is not allowed!');
        return false;
        try {
            Admin.deleteMany({}, function (err, users) {
                if (err) throw err;
                console.log('Useraaaa ', users)
                respHandler.sendSuccess(res, 200, 'All users Deleted!', {});
            });
        } catch (err) {
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to delete users');
        }
    },
    changePassword: (req, res, next) => {
        respHandler.sendError(res, 400, 'FAILURE', 'Api not implemented');
    },
    createAdminAvatar: (req, res, next) => {
        respHandler.sendError(res, 400, 'FAILURE', 'Api not implemented');
    },
    deleteAdminAvatar: (req, res, next) => {
        respHandler.sendError(res, 400, 'FAILURE', 'Api not implemented');
    },
    addAdminPermission: (req, res, next) => {
        respHandler.sendError(res, 400, 'FAILURE', 'Api not implemented');
    },
    removeAdminPermission: (req, res, next) => {
        respHandler.sendError(res, 400, 'FAILURE', 'Api not implemented');
    },
};

module.exports = AdminController;

