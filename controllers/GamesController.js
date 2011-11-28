/**
 * Games page Controller.
 */
var GamesController = function(app, conf) {
  this.app    = app;
  this.conf   = conf;
  
  // GET Routes.
  app.get('/games', app.middlewares.mustBeLoggedIn, this.index);
  app.get('/games/:id'
          , app.middlewares.mustBeLoggedIn
          , app.models.Game.findById
          , this.game);
  
  // POST Routes.
  app.post('/games', app.middlewares.mustBeLoggedIn, this.createGame);
  
  // PUT Routes.
  
  // DELETE Routes.

}

/**
 * Index Page.
 */
GamesController.prototype.index = function(req, res) {
  req.app.modules.io.sockets.on('connection', function(socket) {
    req.app.models.Game.findAvailable(function(err, games) {
      socket.emit('games', games);
    });
  });
  res.render('games');
}

/**
 * Game Page.
 */
GamesController.prototype.game = function(req, res) {
  res.render('game');
}

/**
 * Create a new game
 */
GamesController.prototype.createGame = function(req, res) {
  req.app.models.Player.findById(req.user._id, function(err, player) {
    if (err) throw err;
    player.createGame(req.body);
  });
  // broadcast the new game
  res.send();
}


// Export a new instance of a RoomController.
module.exports = function(app, conf) {
  return new GamesController(app, conf);
};
