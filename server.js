/**
 * Required Modules
 */
var util = require('util')
  , express = require('express')
  , mongoose = require('mongoose')
  , mongooseAuth = require('mongoose-auth');


/**
 * Initialise mongoose connection and models loading
 */
mongoose.connect('mongodb://localhost/noban');
var Player = require('./models/players');
 

/**
 * Create the main app
 */
var app = module.exports = express.createServer();


/**
 * Configuration
 */
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  //app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'hariom' }));
  //app.use(stylus.middleware({
    //src: __dirname + '/public'
    //, compile: function(str, path){
      //return stylus(str)
      //.set('filename', path)
      //.set('compress', true)
      //.use(nib());
    //}   
  //}));
  //app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(mongooseAuth.middleware());
});


/**
 * Map routes
 */
var home = require('./controllers/home');
home.route(app);


/**
 * Start the server
 */

if (!module.parent) {
  mongooseAuth.helpExpress(app);
  app.listen(3000);
  console.log('noban server running on %s:%d', app.address().address, app.address().port);
}
