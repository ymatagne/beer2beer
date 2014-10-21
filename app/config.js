module.exports = function (app, express) {
    app.set('views', 'front/views/');
    app.use(express.static('front/public'));
    app.engine('jade', require('jade').__express);
    app.set('view engine', 'jade');
    app.set('port', 3000);
    app.set('host', "localhost");
};
