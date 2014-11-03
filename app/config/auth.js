var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');

module.exports = function (app ) {
    app.use(cookieParser());
    app.use(session({ secret: 'securedsession', saveUninitialized: true,resave: true }));


    // Serialize sessions
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findOne({ _id: id }, function (err, user) {
        done(err, user);
      });
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      },
      function(email, password, done) {
        User.findOne({ email: email }, function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {
              'errors': {
                'email': { type: 'Email is not registered.' }
              }
            });
          }
          if (user.password !==password) {
            return done(null, false, {
              'errors': {
                'password': { type: 'Password is incorrect.' }
              }
            });
          }
          return done(null, user );
        });
      }
    ));

    app.use(passport.initialize());
    app.use(passport.session());
};
