const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const User = connection.models.User;
const validPassword = require('../lib/passwordUtils').validPassword;

//passport-local looks for username and password. So if we want to use custom fields we do like this.
const customFields = {
    usernameField: "uname",
    passwordField: "pw"
};

// define verify callback for passsport local strategy
const verifyCallback = (username, password, done) => {
    User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!verifyPassword(password, user.hash, user.salt)) { return done(null, false); }
        return done(null, user);
      });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId, function (err, user) {
        if (err) { return done(err); }
        return done(null, user);
    })
});