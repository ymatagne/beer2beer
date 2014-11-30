var site = require('../controllers/siteController');
var beersController = require('../controllers/beerController');
var barsController = require('../controllers/barController');
var authController = require('../controllers/authController');

var is_authentified = function(req, res, next){
  if (!req.isAuthenticated())
    res.status(401).end();
  else
  	next();
};

module.exports = function(app){
    /** Authentification **/
    app.get('/api/auth/google/',authController.auth_google);
    app.get('/api/auth/google/callback',authController.auth_google_callback);
    app.post('/api/auth/create',authController.auth_create);
    app.post('/api/auth/local',authController.auth_local);
    app.get('/api/auth/loggedin',authController.loggedin);
    app.get('/api/auth/logout',authController.logout);

    /** Beer Crud **/
    app.get('/api/beer/', is_authentified,beersController.json_beer_query);
    app.get('/api/beer/:beer_id/', is_authentified,beersController.json_beer_get);
    app.post('/api/beer/:beer_id/', is_authentified,beersController.json_beer_save);
    app.delete('/api/beer/:beer_id/', is_authentified,beersController.json_beer_delete);

    /** Bar Crud **/
    app.get('/api/bar/', barsController.json_bar_query);
    app.put('/api/bar/:id', is_authentified,barsController.json_bar_update);
    app.post('/api/bar/', is_authentified,barsController.json_bar_save);

    /** Angular Route **/
    app.get('/templates/:name', site.partials);
    app.get('*', site.index);
};
