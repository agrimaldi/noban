/**
 * Game model
 */
module.exports = function(app, conf) {
  var GameSchema        = require('./Schemas').GameSchema
    , ObjectId      = app.db.SchemaTypes.ObjectId
    , mongooseAuth  = app.modules.mongooseAuth
    , Game = null;


  /**
   * Methods
   */
  GameSchema.statics.findByTitle = function (title, callback) {
    return this.find({ title: title }, callback);
  }


  /**
   * Define model.
   */
  Game = app.db.model('Game', GameSchema);
  

  /**
   * Return the Player model
   */
  return Game
}
