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
 Description: Auth user in local base
 Method: GET
 */
module.exports.auth_local = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        exports.manageAuthLocal(req, res, err, user, info);
    })(req, res, next);
};

/*
 Description: Return User if user is auth else return 0
 Method: GET
 */
module.exports.loggedin= function (req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
};

/*
 Description: Loggout user
 Method: GET
 */
module.exports.loggout= function (req, res) {
    if(req.user) {
        req.logout();
        res.send(200);
    } else {
        res.send(400, "Not logged in");
    }
};
module.exports.manageAuthLocal = function(req, res, err, user, info){
    var error = err || info;
    if (error) {
        return res.json(400, error);
    }
    req.logIn(user, function (err) {
        exports.manageUserLogin(req, res, err);
    });
}
module.exports.manageUserLogin = function(req, res, err){
    if (err) {
        return res.send(err);
    }
    res.send(req.user);
}
module.exports.setPassport = function (fakePassport) {
    this.passport = fakePassport;
};