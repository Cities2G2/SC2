var express = require('express');
var wagner = require('wagner-core');

require('./model/models')(wagner);

var app = express();

app.use('/object', require('./routes/object.route')(wagner));

/*app.use(express.static('www'));

app.get('/', function(req, res) {
    res.sendfile('./www/index.html');
});*/

app.listen(3002);
console.log('Listening on port 3002!');