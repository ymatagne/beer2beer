var passport = require('passport'),
    User = require('../models/user'),
    bodyParser = require('body-parser');

module.exports = function (app, express) {
    app.set('views', 'front/views/');
    app.use(express.static('front/public'));
    app.engine('jade', require('jade').__express);
    app.set('view engine', 'jade');
    app.set('port',  (process.env.PORT || 5000));
    app.set('host', "localhost");
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
};
