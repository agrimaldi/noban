/**
 * Games page Controller.
 */
var GamesController = function(app, conf) {
  this.app    = app;
  this.conf   = conf;
  
  // GET Routes.
  app.get('/games', app.middlewares.mustBeLoggedIn, this.index);
  
  // POST Routes.
  
  // PUT Routes.
  
  // DELETE Routes.

  // SOCKETS
  app.modules.io.sockets.on('connection', function(socket) {
    app.models.Game.findAvailable(function(err, games) {
      socket.emit('games', games);
    });
  });
}

/**
 * Index Page.
 */
GamesController.prototype.index = function(req, res) {
  res.render('games');
}


// Export a new instance of a RoomController.
module.exports = function(app, conf) {
  return new GamesController(app, conf);
};
