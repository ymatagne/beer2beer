var site = require('../controllers/siteController'),
    beersController = require('../controllers/beerController'),
    barsController = require('../controllers/barController'),
    typeController = require('../controllers/typeController'),
    authController = require('../controllers/authController'),
    userController = require('../controllers/userController'),
    breweryController = require('../controllers/breweryController');


function isAuthentified(req, res, next) {
    if (!req.isAuthenticated()) {
        res.status(401).end();
    } else {
        next();
    }
}

function isAdmin(req, res, next) {
    if (!req.isAuthenticated()) {
        res.status(401).end();
    } else if (req.user.role !== 'ADMIN') {
        res.status(403).end();
    } else {
        next();
    }
}

module.exports = function (app) {
    /** Authentification **/
    app.get('/api/auth/google/', authController.authGoogle());
    app.get('/api/oauth2callback', authController.authGoogleCallback());
    app.post('/api/auth/create', authController.createUser);
    app.post('/api/auth/local', authController.authLocal);
    app.get('/api/auth/loggedin', authController.loggedin);
    app.get('/api/auth/logout', authController.logout);

    /** Beer Crud **/
    app.get('/api/beer/', beersController.getBeers);
    app.get('/api/beer/search', beersController.getBeerWithParams);
    app.get('/api/beer/:beer_id/', isAuthentified, beersController.getBeerById);
    app.post('/api/beer/', isAdmin, beersController.saveBeer);

    /** Brewery Crud **/
    app.get('/api/brewery/', breweryController.getBreweries);

    /** Type Crud **/
    app.get('/api/type/', typeController.getTypes);

    /** Bar Crud **/
    app.get('/api/bar/', barsController.getBars);
    app.put('/api/bar/:id', isAuthentified, barsController.updateBar);
    app.delete('/api/bar/:id', isAuthentified, barsController.deleteConsumption);
    app.put('/api/bar/', isAuthentified, barsController.updateFullBar);
    app.post('/api/bar/', isAuthentified, barsController.saveBar);
    app.put('/api/bar/:id/consumption', isAdmin, barsController.updateConsumption);
    app.get('/api/bar/all', barsController.getAllBar);
    app.get('/api/bar/beers', barsController.getBarByIdwithBeer);

    /** User Crud **/
    app.get('/api/user', isAdmin, userController.getUsers);
    app.delete('/api/user', isAdmin, userController.deleteUser);
    app.put('/api/user', isAdmin, userController.updateUser);

    /** Angular Route **/
    app.get('/templates/:name', site.partials);
    app.get('*', site.index);
};
