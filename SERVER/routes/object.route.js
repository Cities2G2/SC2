var passport = require('passport');
var bodyparser = require('body-parser');
var express = require('express');
var bigInt = require('../src/big-integer-scii.js');
var status = require('http-status');
var _ = require('underscore');
var CryptoJS = require("crypto-js");
var rsa = require('../src/rsa-big-integer.js');
keys = rsa.generateKeys(512);
module.exports = function (wagner) {
    var objectRoute = express.Router();
    objectRoute.use(bodyparser.json());

    //GET - Return a list of User
    objectRoute.get('/destiny/:Destiny', wagner.invoke(function (Object) {
        return function (req, res) {
            console.log("GET - /object/:Destiny");
            Object.find(function (err, objects) {
                if (err) res.send(500, "Mongo Error");
                else res.send(200, objects);
            });
        }
    }));

    //GET - Return a list of User
    objectRoute.get('/id/:id', wagner.invoke(function (Object) {
        return function (req, res) {
            console.log("GET - /user/:Username");
            Object.findOne({_id: req.params.id}, function (err, object) {
                if (err) res.send(500, 'Server error');
                else {
                    if (object) res.send(200, object);
                    else res.send(404, 'No se encuentra este id de objeto, revise la petición');
                }

            });
        }
    }));

    //POST - Insert a new Message in the DB
    objectRoute.post('/datanr', wagner.invoke(function (Object) {
        return function (req, res) {
            console.log("POST - /object/datanr");
            //var publicKeyOrg = rsa.publicKeyP(req.body.publicKey.n, req.body.publicKey.e);
            //var proofOrg = publicKeyOrg.decrypt(req.body.PO);
            //console.log(proofOrg);
            var hash = CryptoJS.SHA1(req.body.data).toString(),
                proofString = "CLIENT" + "AAA" + req.body.identMsg + "AAA" + hash,
                proofBigInt = bigInt(proofString.toString('hex'), 16),
                proofRec = keys.privateKey.encrypt(proofBigInt);

            var newObject = new Object({
                data: req.body.data,
                source: req.body.source,
                destiny: req.body.destiny,
                dataC: req.body.data,
                identData: req.body.identMsg
            });

            var serverRes = {
                destiny: req.body.source,
                identMsg: req.body.identMsg,
                PR: proofRec,
                publicKey: keys.publicKey
            };

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

    //POST - Insert a new Message in the DB
    objectRoute.put('/keynr', wagner.invoke(function (Object) {
        return function (req, res) {
            console.log("PUT - /object/keynr");
            Object.findOne({identData: req.body.identData}, function (err, object) {
                if (err) res.status(500).send('Server error');
                else {
                    if (object) {
                        var bytes  = CryptoJS.AES.decrypt(object.dataC, req.body.key);
                        var plaintext = bytes.toString(CryptoJS.enc.Utf8);
                        object.key = req.body.key;
                        object.dataCK = plaintext;
                        console.log(object);
                        object.save(function (err) {
                            if (!err) {
                                res.status(200).send('OK');
                            } else {
                                if (err.name == 'ValidationError') {
                                    res.status(400).send('Validation error');
                                } else {
                                    res.status(500).send('Server error');
                                }
                            }
                        });

                    }
                    else res.status(404).send('No se encuentra este identData de objeto, revise la petición');
                }

            });
        }
    }));

//GET - BS - returns N public parameter
    objectRoute.get('/data', wagner.invoke(function (Object) {
        return function (req, res) {
            console.log("GET - /object/data");


            var serverRes = new Object({
                N: keys.publicKey.n.toString(10),
                E: keys.publicKey.e.toString(10)
            });

            var datares = new Object({
                data: keys.publicKey.n.toString(10)
            });
            res.status(200).send(datares);
        }
    }));


    //Post Blind Signature
    objectRoute.post('/bs', wagner.invoke(function (Object) {
        return function (req, res) {
            console.log('POST - /object/bs');
            var n = req.body.N;
            var o = req.body.data;
            var r= req.body.R;
            console.log('o es:(ha de ser igual a bc) ', o);
            //console.log('N es: ', n);

            N = bigInt(n);
            O = bigInt(o);
            R = bigInt(r);

            /////probando
            var num = bigInt("134123412412414341441324");
            //console.log('num³ mod N', num.modPow(3, N).mod(N));
            /////

            /*console.log('Pre modpow: ', O.toString(10));
            O2 = O.modPow(3, N).mod(N);
            //O2=O;
            console.log('Post modpow: ', O2.toString(10));*/

            O2= keys.privateKey.encrypt(O);
            console.log('(blind) encryption with private:', '\n', O2.toString(10), '\n');

            var serverRes = new Object({
                source: req.body.destiny,
                destiny: req.body.source,
                data: O2.toString(10),
                publickey: keys.publicKey.toString(10)
            });

            res.status(200).send(serverRes);

        }
    }));

    return objectRoute;
};