const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose');
const session = require('cookie-session');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const configAuth = require('./config/constants');


/**
 * Connection begins
 */
mongoose.connect(configAuth.MONGO_URL, configAuth.MONGO_OPTIONS);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error, unable to connect to the database!'));
db.once('open', function () {
    // connected
    console.log('Connected correctly to server(BRTApplication)');
});
// Connection ends here.


// SWAGGER ROUTES
const indexRouter = require('./routes/index');
// USERS ROUTES
const usersRouter = require('./routes/users');
// AUTH ROUTE
const authRouter = require('./routes/auth');
// ADMIN ROUTE
const adminRouter = require('./routes/admin');
// BRTROUTE ROUTE
const brtRouter = require('./routes/brtRoutes');
// WALLET ROUTE
const walletRouter = require('./routes/wallet');
// PAYMENT OPTION ROUTE
const paymentOptionRouter = require('./routes/payment-option');
// TRANSACTION ROUTE
const transactionRouter = require('./routes/transaction');

const app = express();

// view engine setup
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');*/

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(session({keys: ['secretKey', 'otherSecretKey', '...']}));

app.use(function (req, res, next) {
   /*    const allowedOrigins = ['http://127.0.0.1:8001', 'http://127.0.0.1:9000', 'localhost:8001'];
    const origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.header("Access-Control-Allow-Origin", origin);

    }*/
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, PATCH, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});



app.use('/api/' + configAuth.VERSION + '/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/' + configAuth.VERSION + '/', indexRouter);
app.use('/api/' + configAuth.VERSION + '/auth', authRouter);
app.use('/api/' + configAuth.VERSION + '/users', usersRouter);
app.use('/api/' + configAuth.VERSION + '/admin', adminRouter);
app.use('/api/' + configAuth.VERSION + '/route', brtRouter);
app.use('/api/' + configAuth.VERSION + '/wallet', walletRouter);
app.use('/api/' + configAuth.VERSION + '/payment-option', paymentOptionRouter);
app.use('/api/' + configAuth.VERSION + '/transaction', transactionRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('This resources you are trying to access is not found on this server.');
    err.status = 'FAILURE';
    err.code = 404;
    err.msg = 'This resources you are trying to access is not found on this server.';
    res.status(404).send(err);
    // next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
    const error = new Error('Internal server Error');

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500).send(error + err);
});

module.exports = app;
