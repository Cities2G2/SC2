var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objectSchema = new Schema({
    _id: { type: String },
    data: { type:String },
    source: {type: String},
    destiny: {type: String}
}, {versionKey: false});

//permitimos que sea llamado desde el archivo principal de la aplicación
module.exports = mongoose.model('Object', objectSchema);
