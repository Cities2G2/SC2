var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    Username : { type : String},
    Password : {type : String}
});

module.exports.set('toObject', { virtuals: true });
module.exports.set('toJSON', { virtuals: true });
