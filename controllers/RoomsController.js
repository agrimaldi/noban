/**
 * Rooms page Controller.
 */
var RoomsController = function(app, conf) {
  this.app    = app;
  this.conf   = conf;
  
  // GET Routes.
  app.get('/rooms', app.middlewares.mustBeLoggedIn, this.index);
  
  // POST Routes.
  
  // PUT Routes.
  
  // DELETE Routes.
}

/**
 * Index Page.
 */
RoomsController.prototype.index = function(req, res) {
  res.render('rooms');
}


// Export a new instance of a RoomController.
module.exports = function(app, conf) {
  return new RoomsController(app, conf);
};
