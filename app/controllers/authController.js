var User = require('../models/user'),
    passport = require('passport');

/*
 Description: Authentification in Google
 Method: GET
 */
module.exports.auth_google = function (req, res, next) {
    console.log('Authentification google');
    passport = req._passport.instance;

    passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/userinfo.email'}, function (err, user, info) {

    })(req, res, next);
};

/*
 Description: Retour authentification Google
 Method: GET
 Output: JSON
 */
module.exports.auth_google_callback = function (req, res) {
    console.log('callback Authentification google');
    passport = req._passport.instance;
    passport.authenticate('google', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('http://localhost:8000');
        }
        User.findOne({email: user._json.email}, function (err, usr) {
            res.writeHead(302, {
                'Location': 'http://localhost:8000/#/index?token=' + usr.token + '&user=' + usr.email
            });
            res.end();
        });
    })(req, res, next);
};

/*
 Description: Create new User
 Method: POST
 Output: JSON
 */
module.exports.auth_create = function (req, res) {
    console.log('create new User');
    var user = new User(req.body.user);
    user.save(function (err) {

        if (err) {
            console.log(err);
            return res.json(400, err);
        }

        req.logIn(user, function (err) {
            if (err) return next(err);
            return res.json(user);
        });
    });
};


/*
 Description: Save beer
 Method: GET
 */
module.exports.auth_local = function (req, res, next) {
    console.log('Authentification local');
    passport.authenticate('local', function (err, user, info) {
        var error = err || info;
        if (error) {
            return res.json(400, error);
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.send(err);
            }
            res.json(req.user);
        });
    })(req, res, next);
};
