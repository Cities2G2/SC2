var express = require('express');
var wagner = require('wagner-core');

require('./model/models')(wagner);

var app = express();

wagner.invoke(require('./auth'), { app: app });

app.use('/user', require('./routes/user.route')(wagner));
app.use('/object', require('./routes/object.route')(wagner));

app.use(express.static('www'));

app.get('/', function(req, res) {
    res.sendfile('./www/index.html');
});

app.listen(3000);
console.log('Listening on port 3000!');