const Users = require('../models/users');
const respHandler = require('../services/responseHandler');
const validate = require('../services/validateService');
const bcrypt = require('bcrypt');
const config = require('../config/constants');
const mailJet = require('../mailSystem/mailSystem');


const UsersController = {
    getUsers: (req, res, next) => {
        try {
            Users.find({}, '_id username confirmedUser createdAt', function (err, users) {
                if(err) throw  err;
                console.log('Users ', users);
                if (validate.resultFound(users, res)){
                    const data = validate.formatData(users);
                    respHandler.sendSuccess(res, 200, 'Users listed successfully', data);
                }
            })
        } catch (err) {
            console.log('Error ', err);
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to list users.', err);
        }
    },
    storeUser: (req, res, next) => {
        try {
            const userObject = req.body;
            console.log('User Object ', req.body);
            bcrypt.hash(req.body.password, 10,  (err, hash) => {
                userObject.password = hash;
                console.log('User Object 2', userObject);

                Users.create(userObject, function (err, user) {
                    console.log('User ', user);
                    if (err) {
                        console.log('err.name' , err.name);
                        switch (err.name) {
                            case 'ValidationError': {
                                let errorMsg = '';
                                if (err.message.includes('`username` to be unique')){
                                    errorMsg = 'Username has been used already!';
                                }
                                respHandler.sendError(res, 406, 'FAILURE', err.message, err);
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
                    else if(validate.resultFound(user, res)) {
                        const data = validate.formatData(user);
                        respHandler.sendSuccess(res, 200, 'User created successfully', data);
                    }
                });
            });

        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to create user');
        }
    },
    getUser: (req, res, next) => {
        try {
            Users.findById(req.params.id, function (err, user) {
                if (err) throw err;
                if(validate.resultFound(user, res)) {
                    const data = validate.formatData(user);
                    respHandler.sendSuccess(res, 200, 'User fetched successfully', data);
                }
            })
        } catch(err) {
            respHandler.sendError(res, 404, 'FAILURE', 'Unable to get user.', err);
        }
    },
    putUser: (req, res, next) => {
        try {
            console.log('This is body ', req.body);
            Users.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function (err, user) {
                if (err) throw err;
                if(user) {
                    user.password = null;
                    respHandler.sendSuccess(res, 200, 'User updated successfully!', user);
                }
            });
        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to update user');
        }
    },
    patchUser: (req, res, next) => {
        try {
            console.log('This is body ', req.body);
            Users.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function (err, user) {
                if (err) throw err;
                if(user) {
                    user.password = null;
                    respHandler.sendSuccess(res, 200, 'User patched successfully!', user);
                }
            });
        } catch (err){
            respHandler.sendError(res, 400, 'FAILURE', 'Unable to patch user');
        }
    },
    deleteUser: (req, res, next) => {
         try {
             Users.findByIdAndDelete(req.params.id, function (err, user) {
                 if (err) throw err;
                 respHandler.sendSuccess(res, 200, 'User deleted successfully!', {});
             });
         } catch (err) {
             respHandler.sendError(res, 400, 'FAILURE', 'Unable to delete user');
         }
    },
    deleteMultiple: (req, res, next) => {
        respHandler.sendError(res, 403, 'FAILURE', 'Forbidden, the action is not allowed!');
        return false;
         try {
             Users.deleteMany({}, function (err, users) {
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
    createUserAvatar: (req, res, next) => {
        respHandler.sendError(res, 400, 'FAILURE', 'Api not implemented');
    },
    deleteUserAvatar: (req, res, next) => {
        respHandler.sendError(res, 400, 'FAILURE', 'Api not implemented');
    }
};

module.exports = UsersController;

function sendEmail(data, req, res, next) {
    mailJet.sendMailAfterUpdate(data, req, res, next)
}