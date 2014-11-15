var express = require('express'),
    mongoose = require('mongoose'),
    config = require( './config/config.js'),
    auth = require( './config/auth.js'),
    app = express();

// Configuration de la base de donnees
mongoose.connect('mongodb://b2b:b2b@ds039950.mongolab.com:39950/beer2beer');

// Configuration du server
config(app, express);

// Gestion de l'authentification
auth(app);

// Definition des routes
require( './config/routes' )( app );

// Demmarage du server
app.listen( app.get( 'port' ),app.get( 'host' ),function () {
    console.log('Example app listening at port http://%s:%s',  app.get( 'host' ),  app.get( 'port' ))
});
