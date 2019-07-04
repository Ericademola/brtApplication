const express = require('express');
const router = express.Router();
const configAuth = require('../config/constants');


router.get('/', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    res.redirect('/api/' +configAuth.VERSION + '/swagger')
});

module.exports = router;
