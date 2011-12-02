/**
 * Module dependencies
 */
var util                                          = require('util')
  , sio                                           = require('socket.io')
  , express                                       = require('express');

var app             = module.exports              = express.createServer();
app.modules                                       = {};

var parseCookie     = app.modules.parseCookie     = require('connect').utils.parseCookie
  , everyauth       = app.modules.everyauth       = require('everyauth')
  , mongoose        = app.modules.mongoose        = require('mongoose')
  , mongooseAuth    = app.modules.mongooseAuth    = require('mongoose-auth')
  , settings                                      = require('./settings')
  , io              = app.modules.io              = sio.listen(app);


/**
 * Load models
 */
app.db              = mongoose;
app.models          = {};
app.models.Game     = require('./models/Game')(app, settings);
app.models.Player   = require('./models/Player')(app, settings);
 

/**
 * Configuration
 */
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    key: 'hariom'
  , secret: 'tatsat'
  }));
  app.use(mongooseAuth.middleware());
  //app.use(stylus.middleware({
    //src: __dirname + '/public'
    //, compile: function(str, path){
      //return stylus(str)
      //.set('filename', path)
      //.set('compress', true)
      //.use(nib());
    //}   
  //}));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true
  , showStack: true
  }));                                                                                                                                                                   
  app.db.connect(settings.mongodb.uri.development);
  everyauth.debug = true;
});

app.configure('test', function() {
  app.use(express.errorHandler());
  app.db.connect(settings.mongodb.uri.test);
});

app.configure('production', function() {
  app.use(express.errorHandler()); 
  app.db.connect(settings.mongodb.uri.production);
});


/**
 * socket.io authentication setup
 */
app.modules.io.set('authorization', function (data, accept) {
    // check if there's a cookie header
    if (data.headers.cookie) {
        // if there is, parse the cookie
        data.cookie = parseCookie(data.headers.cookie);
        // note that you will need to use the same key to grad the
        // session id, as you specified in the Express setup.
        data.sessionID = data.cookie['hariom'];
    } else {
       // if there isn't, turn down the connection with a message
       // and leave the function.
       return accept('No cookie transmitted.', false);
    }
    // accept the incoming connection
    accept(null, true);
});


/**
 * Helpers
 */
mongooseAuth.helpExpress(app);


/**
 * Route Middlewares
 */
app.middlewares                   = {}
app.middlewares.mustBeLoggedIn    = require('./middlewares').mustBeLoggedIn;


/**
 * Load Controllers
 */
app.controllers             = {}
app.controllers.app         = require('./controllers/AppController')(app, settings);
//app.controllers.error       = require('./controllers/ErrorController')(app, settings);
app.controllers.games       = require('./controllers/GamesController')(app, settings);


/**
 * Catch-all 404 handler (No more routes after this one)
 */
//app.get('/*', function(req, res, next) {
  //next(new NotFound('Page not found.'));
//});


/**
 * Only listen on $ node app.js
 */
if (!module.parent) {
  app.listen(settings.port);
  console.log("noban server listening on port %d in %s mode", app.address().port, app.settings.env);
}
