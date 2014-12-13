var site = require('../controllers/siteController');
var beersController = require('../controllers/beerController');
var barsController = require('../controllers/barController');
var typeController = require('../controllers/typeController');
var authController = require('../controllers/authController');
var breweryController = require('../controllers/breweryController');

function isAuthentified(req, res, next){
    if (!req.isAuthenticated()) {
        res.status(401).end();
    }else {
        next();
    }
}

function isAdmin(req, res, next){
    if(!req.isAuthenticated()){
        res.status(401).end();
    } else if(req.user.role !== 'ADMIN'){
        res.status(403).end();
    } else {
        next();
    }
}

module.exports = function(app){
    /** Authentification **/
    app.get('/api/auth/google/',authController.auth_google);
    app.get('/api/auth/google/callback',authController.auth_google_callback);
    app.post('/api/auth/create',authController.auth_create);
    app.post('/api/auth/local',authController.auth_local);
    app.get('/api/auth/loggedin',authController.loggedin);
    app.get('/api/auth/logout',authController.logout);

    /** Beer Crud **/
    app.get('/api/beer/', beersController.json_beer_query);
    app.get('/api/beer/search', beersController.json_beer_query_with_params);
    app.get('/api/beer/:beer_id/', isAuthentified,beersController.json_beer_get);
    app.post('/api/beer/', isAdmin,beersController.json_beer_save);
    app.delete('/api/beer/:beer_id/', isAdmin,beersController.json_beer_delete);

    /** Brewery Crud **/
    app.get('/api/brewery/', breweryController.json_brewery_query_all);

    /** Type Crud **/
    app.get('/api/type/', typeController.json_type_query_all);

    /** Bar Crud **/
    app.get('/api/bar/', barsController.json_bar_query);
    app.put('/api/bar/:id', isAuthentified,barsController.json_bar_update);
    app.post('/api/bar/', isAuthentified,barsController.json_bar_save);
    app.put('/api/bar/:id/consumption', isAdmin,barsController.json_bar_update_consumptions);
    app.get('/api/bar/all', barsController.json_bar_all);
    app.get('/api/bar/beers',barsController.json_bar_with_beer)
    /** Angular Route **/
    app.get('/templates/:name', site.partials);
    app.get('*', site.index);
};
