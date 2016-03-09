var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    Username : { type : String},
    Password : {type : String}
}, {versionKey: false});

//permitimos que sea llamado desde el archivo principal de la aplicación
module.exports = mongoose.model('User', userSchema);
