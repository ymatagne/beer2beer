var passport = require('passport'),
    GoogleStrategy = require('passport-google').Strategy,
    LocalStrategy = require('passport-local').Strategy,
    User = require('./models/user')
    bodyParser = require('body-parser');

module.exports = function (app, express) {
    app.set('views', 'front/views/');
    app.use(express.static('front/public'));
    app.engine('jade', require('jade').__express);
    app.set('view engine', 'jade');
    app.set('port', 3000);
    app.set('host', "localhost");
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())


    // Serialize sessions
    passport.serializeUser(function(user, done) {
      console.log('serialize');
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      console.log('deserialize')
      User.findOne({ _id: id }, function (err, user) {
        console.log('find')
        done(err, user);
      });
    });

    passport.use(new GoogleStrategy({
        returnURL: 'http://www.example.com/api/auth/google/callback',
        realm: 'http://www.example.com/'
      },
      function(identifier, profile, done) {
        User.findOrCreate({ openId: identifier }, function(err, user) {
          done(err, user);
        });
      }
    ));

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
          return done(null, user);
        });
      }
    ));

    app.use(passport.initialize());
    app.use(passport.session());
};
