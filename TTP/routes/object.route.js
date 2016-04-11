var passport = require('passport');
var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');
var http = require('http');
var querystring = require('querystring');

module.exports = function(wagner) {
    var objectRoute = express.Router();
    objectRoute.use(bodyparser.json());

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
                source: "TTP",
                destiny: req.body.destiny
            });

            var ttpToServer = JSON.stringify(ttpRes);
            var options = {
                host: "localhost",
                port: 3000,
                path: '/object/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    "Content-Length": Buffer.byteLength(ttpToServer)
                }
            };

            newObject.save(function (err) {
                if (!err) {
                    res.status(200).send(ttpRes);
                    console.log(newObject);
                    //NodeJS
                    var reqPost = http.request(options);
                    reqPost.end(ttpToServer);
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