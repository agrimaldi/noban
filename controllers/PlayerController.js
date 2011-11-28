/**
 * Player page Controller.
 */
var PlayerController = function(app, conf) {
  this.app    = app;
  this.conf   = conf;
  
  // GET Routes.
  app.get('/player', app.middlewares.mustBeLoggedIn, this.index);
  
  // POST Routes.
  
  // PUT Routes.
  
  // DELETE Routes.
}

/**
 * Index Page.
 */
PlayerController.prototype.index = function(req, res) {
  res.render('player');
}


// Export a new instance of a RoomController.
module.exports = function(app, conf) {
  return new PlayerController(app, conf);
};
