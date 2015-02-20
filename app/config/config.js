var bodyParser = require('body-parser'),
    mongoose = require('mongoose');

module.exports = function (app, express) {

    console.log('Configuration de la base de données...');
    mongoose.connect(process.env.MONGOLAB_URI);

    console.log('Configuration du serveur...');
    app.set('views', 'front/views/');
    app.use(express.static('front/public'));
    app.engine('jade', require('jade').__express);
    app.set('view engine', 'jade');
    app.set('port', (process.env.PORT || 5000));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
};