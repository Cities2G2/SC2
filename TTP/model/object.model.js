var mongoose = require('mongoose');

var objectSchema = {
    _id: { type: String },
    source: {type: String},
    destiny: {type: String},
    key: {type: String},
    identData: {type: String}
};

module.exports = new mongoose.Schema(objectSchema, {versionKey: false});
module.exports.categorySchema = objectSchema;