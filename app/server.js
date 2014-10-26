var express = require('express');
var mongoose = require('mongoose');
var config = require( './config.js' );
var app = express();

// Configuration de la base de donnees
mongoose.connect('mongodb://b2b:b2b@ds039950.mongolab.com:39950/beer2beer');

// Configuration du server
config(app, express );

// Definition des routes
require( './routes' )( app );

// Demmarage du server
app.listen( app.get( 'port' ),app.get( 'host' ),function () {
    console.log('Example app listening at port http://%s:%s',  app.get( 'host' ),  app.get( 'port' ))
});
