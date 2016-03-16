var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
    mongoose.connect('mongodb://localhost:27017/cities2final');

    wagner.factory('db', function() {
        return mongoose;
    });

    var Object =
        mongoose.model('Object', require('./object.model'), 'objects');
    var User =
        mongoose.model('User', require('./users.model'), 'users');

    var models = {
        Object: Object,
        User: User
    };

    // To ensure DRY-ness, register factories in a loop
    _.each(models, function(value, key) {
        wagner.factory(key, function() {
            return value;
        });
    });

    return models;
};