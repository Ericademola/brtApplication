const Response = require('../interfaces/response');
const controllerService = require('../services/controllerServices');

const handleMessage = {
sendError: function (res, code, status, message, error){
    const err = new Error(message);
    err.status = status;
    err.code = code;
    err.msg = message;
    (error) ? err.ERROR = error : '';
    res.status(code).send(err);
},

    checkMe: function (res, code, status, message, error){
    console.log('This just happened');
},

sendSuccess: function (res, code, message, data, encode= true){
    if(encode === 'USERLOGIN'){
        Response.data = data;
    } else {
        if(data && data !== null && data !== undefined) {
            // Response.data = controllerService.convertDataToJWT({data_: data});
            Response.data = data;
        } else {
            Response.data = data;
        }
    }
    Response.msg = message;
    if(code){
        Response.code = code;
    }
    res.json(Response);
}

};
module.exports = handleMessage;
