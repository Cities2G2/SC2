var passport = require('passport');
var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');

module.exports = function(wagner) {
    var userRoute = express.Router();
    userRoute.use(bodyparser.json());

    //GET - Return a list of User
    userRoute.get('/',wagner.invoke(function(User){
        return function (req, res){
            console.log("GET - /user");
            User.find(function (err, users) {
                if (err) res.send(500, "Mongo Error");
                else res.send(200, users);
            });
        }
    }));

    //GET - Return a list of User
    userRoute.get('/:Username',wagner.invoke(function(User){
        return function (req, res){
            console.log("GET - /user/:Username");
            User.findOne({Username: req.params.Username}, function (err, user) {
                if(err) res.send(500, 'Server error');
                else {
                    if(user) res.send(200, user);
                    else res.send(404, 'No se encuentra este nombre de usuario, revise la petición');
                }

            });
        }
    }));

    //POST - Insert a new User in the DB
    userRoute.post('/', wagner.invoke(function(User){
        return function(req, res) {
            console.log('POST - /user');
            console.log(req.body);
            User.findOne({Username: req.body.Username}, function (err, user) {
                if (!user) {
                    var newUser = new User({
                        Username: req.body.Username,
                        Password: req.body.Password
                    });

                    newUser.save(function (err) {
                        if (!err) {
                            res.send(200, "Okey");
                        } else {
                            console.log(err);
                            if (err.name == 'ValidationError') {
                                res.send(400, 'Validation error');
                            } else {
                                res.send(500, 'Server error');
                            }
                        }
                    });
                } else {
                    res.send(400, 'There is a User with this Username');
                }
            });
        }
    }));

    return userRoute;
};