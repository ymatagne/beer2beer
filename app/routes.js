var site = require('./controllers/siteController');
var beersController = require('./controllers/beerController');
var authController = require('./controllers/authController');

module.exports = function(app){
    /** Authentification **/
    app.get('/api/auth/google/',authController.auth_google);
    app.get('/api/auth/google/callback',authController.auth_google_callback);
    app.post('/api/auth/create',authController.auth_create);
    app.get('/api/auth/local',authController.auth_local);
	  app.get('/api/auth/local/callback',authController.auth_local_callback);

    /** Beer Crud **/
    app.get('/api/beer/', beersController.json_beer_query);
    app.get('/api/beer/:beer_id/', beersController.json_beer_get);
    app.post('/api/beer/:beer_id/', beersController.json_beer_save);
    app.delete('/api/beer/:beer_id/', beersController.json_beer_delete);

    /** Angular Route **/
    app.get('*', site.index);
};
