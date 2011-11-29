/**
 * Games page Controller.
 */
var GamesController = function(app, conf) {
  this.app    = app;
  this.conf   = conf;
  
  
  // GET Routes.
  app.get('/games', app.middlewares.mustBeLoggedIn, this.index);
  app.get('/games/:id', app.middlewares.mustBeLoggedIn, this.game);
  
  // POST Routes.
  
  // PUT Routes.
  
  // DELETE Routes.
};


/**
 * Index Page.
 */
GamesController.prototype.index = function(req, res) {
  req.app.modules.io.sockets.on('connection', function(socket) {
    req.app.models.Game.findAvailable(function(err, games) {
      socket.emit('games', games);
    });
    socket.on('newgame', function(data) {
      createGame(data, req);
    });
  });
  res.render('games');
};

/**
 * Game Page.
 */
GamesController.prototype.game = function(req, res) {
  refresh(req.app);
  req.app.models.Game.findById(req.params.id, function(err, game) {
    res.render('game', game);
  });
};


/**
 * Create a new game
 */
var createGame = function(data, req) {
  var player = req.app.models.Player.findById(req.user._id, function(err, player) {
    player.createGame(data, function(err, game) {
      refresh(req.app);
    });
  });
};


/**
 * Refresh available games
 */
var refresh = function(app) {
  app.models.Game.findAvailable(function(err, games) {
    app.modules.io.sockets.emit('games', games);
  });
};


// Export a new instance of a RoomController.
module.exports = function(app, conf) {
  return new GamesController(app, conf);
};
