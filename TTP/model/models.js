var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
    mongoose.connect('mongodb://localhost:27017/cities2finalTTP');

    wagner.factory('db', function() {
        return mongoose;
    });

    var Object =
        mongoose.model('Object', require('./object.model.js'), 'objects');

    var models = {
        Object: Object
    };

    // To ensure DRY-ness, register factories in a loop
    _.each(models, function(value, key) {
        wagner.factory(key, function() {
            return value;
        });
    });

    return models;
};