/**
 * Required Modules
 */
var util = require('util')
  , express = require('express')
  , auth = require('everyauth')
  , mongoose = require('mongoose');


/**
 * Initialise mongoose connection and models loading
 */
mongoose.connect('mongodb://localhost/noban');
var Player = mongoose.model('Player');
 

/**
 * Authentication
 */
auth.debug = true;

var addUser = function(credentials) {
  var user;
  user = credentials;
  user.id = ++nextUserId;
  return usersById[nextUserId] = user;
}

var usersById = {}
  , nextUserId = 0
  , usersByLogin = {
  'agrim@noban.com': addUser({
    login: 'agrim@noban.com',
    password: 'pass'
  })
};

auth
  /**
   * Login
   */
  .password
    .loginWith('email')
    .getLoginPath('/login')
    .postLoginPath('/login')
    .loginView('login.jade')
    .loginLocals( function (req, res, done) {
      setTimeout( function () {
        done(null, { title: 'Async login' });
      }, 200);
    })
    .authenticate( function (login, password) {
      var errors = [];
      if (!login) errors.push('Missing login');
      if (!password) errors.push('Missing password');
      if (errors.length) return errors;
      var user = usersByLogin[login];
      if (!user) return ['Login failed'];
      if (user.password !== password) return ['Login failed'];
      return user;
    })
    /**
     * Registration
     */
    .getRegisterPath('/register')
    .postRegisterPath('/register')
    .registerView('register.jade')
    .registerLocals( function (req, res, done) {
      setTimeout( function () {
        done(null, { title: 'Async Register' });
      }, 200);
    })
    .validateRegistration( function (newUserAttrs, errors) {
      var login = newUserAttrs.login;
      if (usersByLogin[login]) errors.push('Login already taken');
      return errors;
    })
    .registerUser( function (newUserAttrs) {
      var login = newUserAttrs[this.loginKey()];
      return usersByLogin[login] = addUser(newUserAttrs);
    })

    .loginSuccessRedirect('/')
    .registerSuccessRedirect('/');



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
  app.use(express.methodOverride());
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
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(auth.middleware());
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
  auth.helpExpress(app);
  app.listen(3000);
  console.log('noban server running on %s:%d', app.address().address, app.address().port);
}
