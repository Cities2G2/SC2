var passport = require('passport');
var bodyparser = require('body-parser');
var express = require('express');
var bigInt = require('../src/big-integer-scii.js');
var status = require('http-status');
var _ = require('underscore');
var CryptoJS = require("crypto-js");
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
            console.log(CryptoJS.AES.decrypt(req.body.data, '12345').toString());
            var publicKeyOrg = rsa.publicKey(req.body.publicKey.bits, req.body.publicKey.n,req.body.publicKey.e);
            var proofOrg = publicKeyOrg.decrypt(req.body.PO);
            console.log(proofOrg);
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


    //Post Blind Signature
    objectRoute.post('/bs', wagner.invoke(function(Object){
        return function(req, res) {
            console.log('POST - /object/bs');
            var n = req.body.N;
            var o = req.body.data;
            console.log('o es:(ha de ser igual a bc) ',o);
            console.log('N es: ',n);

            N = bigInt(n);
            O = bigInt(o);

            /////probando
            var num = bigInt("134123412412414341441324");
            console.log('num³ mod N',num.modPow(3,N).mod(N));
            /////

            console.log('Pre modpow: ',O.toString(10));
            O2 = O.modPow(3,N).mod(N);
            //O2=O;
            console.log('Post modpow: ',O2.toString(10));

            var serverRes = new Object({
                source: req.body.destiny,
                destiny: req.body.source,
                data: O2.toString(10)
            });

            res.status(200).send(serverRes);

        }
    }));

    return objectRoute;
};