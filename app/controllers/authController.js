var User = require('../models/user'),
    passport = require('passport');

/*
 Description: Authentification in Google
 Method: GET
 */
module.exports.auth_google = function () {
    return passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] })
};

/*
 Description: Retour authentification Google
 Method: GET
 Output: JSON
 */
module.exports.auth_google_callback = function () {
    return passport.authenticate('google', { failureRedirect: '/',successRedirect:'/#/' })
};

/*
 Description: Create new User
 Method: POST
 Output: JSON
 */
module.exports.auth_create = function (req, res) {
    console.log('create new User');
    var user = new User(req.body.user);
    // Par defaut, role "USER". Le role "ADMIN" est attribué directement en base, pour le moment.
    user.role = 'USER';
    user.type='local';
    user.save(function (err) {
        if (err) {
            return res.status(400).json(err);
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
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
        var error = err || info;
        if (error) {
            return res.status(400).json(error);
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.send(err);
            }
            res.send(req.user);
        });
    })(req, res, next);
};

/*
 Description: Return User if user is auth else return 0
 Method: GET
 */
module.exports.loggedin = function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
};

/*
 Description: Loggout user
 Method: GET
 */
module.exports.logout = function (req, res) {
    if (req.isAuthenticated()) {
        req.logout();
        res.redirect('/');
    } else {
        res.send(400, "Not logged in");
    }
};
module.exports.setPassport = function (fakePassport) {
    this.passport = fakePassport;
};
module.exports.setUser = function (fakeUser) {
    User = fakeUser;
};