var passport = require('passport');
var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');
//var bInt = require('../src/big-integer-scii');
//var rsa = require('../src/rsa-bignum');

module.exports = function(wagner) {
    var objectRoute = express.Router();
    objectRoute.use(bodyparser.json());

    //GET - Return a list of User
    objectRoute.get('/destiny/:Destiny',wagner.invoke(function(Object){
        return function (req, res){
            console.log("GET - /object/:Destiny");
            Object.find(function (err, objects) {
                if (err) res.send(500, "Mongo Error");
                else res.send(200, objects);
            });
        }
    }));

    //GET - Return a list of User
    objectRoute.get('/id/:id',wagner.invoke(function(Object){
        return function (req, res){
            console.log("GET - /user/:Username");
            Object.findOne({_id: req.params.id}, function (err, object) {
                if(err) res.send(500, 'Server error');
                else {
                    if(object) res.send(200, object);
                    else res.send(404, 'No se encuentra este id de objeto, revise la petición');
                }

            });
        }
    }));

    //POST - Insert a new User in the DB
    objectRoute.post('/', wagner.invoke(function(Object){
        return function(req, res) {
            console.log('POST - /object');
            console.log(req.body);
            var newObject = new Object({
                data: req.body.data,
                source: req.body.source,
                destiny: req.body.destiny
            });

            var serverRes = new Object({
                source: req.body.destiny,
                destiny: req.body.source
            });

            newObject.save(function (err) {
                if (!err) {
                    res.status(200).send(serverRes);
                } else {
                    console.log(err);
                    if (err.name == 'ValidationError') {
                        res.status(400).send('Validation error');
                    } else {
                        res.status(500).send('Server error');
                    }
                }
            });
        }
    }));

    return objectRoute;
};