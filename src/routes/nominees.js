var express = require('express'),
    models = require('../models'),
    async = require('async');

var router = express.Router();

router.get('/nominees.json', function(req, res, next) {
    models.nominees(function (err,nominees) {
        res.json({
            nominees: nominees
        });
    });
});

module.exports = router;
