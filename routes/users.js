module.exports = function(app) {
  var User = require('../model/users.model.js');

  findAllUsers = function (req, res) {
    console.log("GET - /users");
    User.find(function (err, users) {
      if (err) res.send(500, "Mongo Error");
      else res.send(200, users);
    });

  };

  app.get('/user', findAllUsers);

};