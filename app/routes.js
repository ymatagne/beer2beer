var site = require('./controllers/siteController');
var beersController = require('./controllers/beerController');

module.exports = function(app){
    app.get('/api/beer/', beersController.json_beer_query);
    app.get('/api/beer/:beer_id/', beersController.json_beer_get);
    app.post('/beer/:beer_id/', beersController.json_beer_save);
    app.delete('/beer/:beer_id/', beersController.json_beer_delete);

    app.get('*', site.index);
};