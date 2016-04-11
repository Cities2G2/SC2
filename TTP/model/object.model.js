var mongoose = require('mongoose');

var objectSchema = {
    _id: { type: String },
    data: { type:String },
    source: {type: String},
    proof: {
        type: {type: String},
        proof: {type: String}
    },
    destiny: {type: String}
};

module.exports = new mongoose.Schema(objectSchema);
module.exports.categorySchema = objectSchema;