var express = require('express'),
    config = require( './config/config.js'),
    auth = require( './config/auth.js'),
    app = express();

// Configuration du server
config(app, express);

// Gestion de l'authentification
auth(app);

// Definition des routes
require( './config/routes' )( app );

// Demmarage du server
app.listen( app.get( 'port' ) ,function () {
    console.log('Example app listening at port http://%s:%s',  app.get( 'host' ),  app.get( 'port' ))
});