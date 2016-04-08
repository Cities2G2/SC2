var passport = require('passport');
var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');
var https = require('https');
//var bInt = require('../src/big-integer-scii');
//var rsa = require('../src/rsa-bignum');

module.exports = function(wagner) {
    var objectRoute = express.Router();
    objectRoute.use(bodyparser.json());

    var options = {
        host: "localhost",
        port: 3000,
        path: '/object/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    //POST - Insert a new User in the DB
    objectRoute.post('/', wagner.invoke(function(Object){
        return function(req, res) {
            console.log('POST - /object');
            console.log(req.body);
            var newObject = new Object({
                data: req.body.key,
                source: req.body.source,
                destiny: req.body.destiny
            });

            var ttpRes = new Object({
                data: req.body.key,
                source: req.body.source,
                destiny: req.body.destiny
            });

            newObject.save(function (err) {
                if (!err) {
                    res.send(200, ttpRes);
                    console.log(newObject);
                    //NodeJS
                    var reqPost = https.request(options, function(){});
                    reqPost.on('error', function(){});
                    reqPost.write(ttpRes);
                    reqPost.end();
                } else {
                    console.log(err);
                    if (err.name == 'ValidationError') {
                        res.send(400, 'Validation error');
                    } else {
                        res.send(500, 'Server error');
                    }
                }
            });
        }
    }));

    return objectRoute;
};