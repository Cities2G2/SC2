var LocalStrategy = require('passport-local').Strategy;

function setupAuth(User, app) {
    var passport = require('passport');
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err,user){
            done(null, id);
        });
    });

    passport.use('login', new LocalStrategy(
        function(username, password, done) {
            User.findOne({ Username: username }, function (err, user) {
                console.log("login");
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                if (!user.verifyPassword(password)) { return done(null, false); }
                return done(null, user);
            });
        }
    ));
    // Express middlewares
    app.use(require('express-session')({
        secret: 'this is a secret'
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.post('/login', passport.authenticate('login', {
        successRedirect: '/success',
        failureRedirect: '/fail'
    }))

}

module.exports = setupAuth;