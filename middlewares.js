/**
 * Application Middlewares
 */
module.exports = {
  
  'mustBeLoggedIn': function(req, res, next) {
    if (!req.loggedIn) {
      res.redirect('/');
    } else {
      next();
    }
  }

}
