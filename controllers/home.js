/**                                                                                                                                               
 * Function used to handle the routing associated to
 * the homepage '/'
 *
 * @param {Object} application
 */
var route = function(app) {
  
  /** 
   * Route to homepage
   *
   * @handle {Route#GET} /
   */
  app.get('/', function(req, res) {
    res.render('home'); 
  }); 

};


/**
 * Expose public functions, classes and methods
 */
exports.route = route;
