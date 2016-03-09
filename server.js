var express = require('express');
var mongoose = require('mongoose');


var app = express();

routes = require('./routes/users')(app);

app.listen(3000);
console.log('Listening on port 3000!');

mongoose.connect('mongodb://localhost:27017/cities2final', function(err, res) {
    if(err) {
        console.log('ERROR: connecting to Database. ' + err);
    } else {
        console.log('Connected to Database');
    }
});