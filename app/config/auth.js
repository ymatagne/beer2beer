var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    User = require('../models/user'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');

module.exports = function (app) {
    app.use(cookieParser());
    app.use(session({secret: 'securedsession', saveUninitialized: true, resave: true}));


    // Serialize sessions
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({_id: id}, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://www.beer-2-beer.com/api/oauth2callback'
        },
        function (accessToken, token,profile,done) {
            User.findOne({email: profile.emails[0].value}, function (err, user) {
                if (err) {
                    console.log(err);
                }
                if (!err && user != null) {
                    return done(null, user);
                } else {
                    var mail=profile.emails[0].value;
                    var pseudo=profile.displayName;
                    var provider=profile.provider;

                    var user = new User({
                        email: mail,
                        pseudo : pseudo,
                        role: 'USER',
                        type: provider
                    });
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("saving user ...");
                            return done(null, user);
                        }
                        ;
                    });
                }
                ;
            });
        }));

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            User.findOne({email: email}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        'errors': {
                            'email': {type: 'Email is not registered.'}
                        }
                    });
                }
                if (user.password !== password) {
                    return done(null, false, {
                        'errors': {
                            'password': {type: 'Password is incorrect.'}
                        }
                    });
                }
                return done(null, user);
            });
        }
    ));

    app.use(passport.initialize());
    app.use(passport.session());
};
