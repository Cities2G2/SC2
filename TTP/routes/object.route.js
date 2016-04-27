var passport = require('passport');
var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');
var http = require('http');
var querystring = require('querystring');
var rsa = require('../src/rsa-big-integer.js');
var bigInt = require('../src/big-integer-scii.js');
keys = rsa.generateKeys(512);

module.exports = function(wagner) {
    var objectRoute = express.Router();
    objectRoute.use(bodyparser.json());

    //POST - Insert a new User in the DB
    objectRoute.post('/', wagner.invoke(function(Object){
        return function(req, res) {
            console.log('POST - /object');

            var proofString = "CLIENT" + "AAA" + "SERVER" + "AAA" + req.body.identMsg + "AAA" + req.body.key,
                proofBigInt = bigInt(proofString.toString('hex'), 16),
                proofKP = keys.privateKey.encrypt(proofBigInt);

            var newObject = new Object({
                source: req.body.source,
                destiny: req.body.destiny,
                key: req.body.key,
                identData: req.body.identMsg
            });

            var ttpRes = {
                source: req.body.source,
                destiny: req.body.destiny,
                identData: req.body.identMsg,
                key: req.body.key,
                PKP: proofKP
            };

            var ttpToServer = JSON.stringify(ttpRes);
            var options = {
                host: "localhost",
                port: 3000,
                path: '/object/keynr',
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    "Content-Length": Buffer.byteLength(ttpToServer)
                }
            };

            newObject.save(function (err) {
                if (!err) {
                    res.status(200).send(ttpRes);
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