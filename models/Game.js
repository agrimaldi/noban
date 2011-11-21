/**
 * Game model
 */
module.exports = function(app, conf) {
  var Schema        = app.db.Schema
    , ObjectId      = Schema.ObjectId
    , mongooseAuth  = app.modules.mongooseAuth;


  /**
   * GameSchema
   */
  var GameSchema = new Schema({
      title: String
    , date: Date
    , size: Number
    , creator: { type: ObjectId, ref: 'PlayerSchema' }
    , players: {
        black: { type: ObjectId, ref: 'PlayerSchema' }
      , white: { type: ObjectId, ref: 'PlayerSchema' }
      , watchers: [{ type: ObjectId, ref: 'PlayerSchema' }]
      }
    , winner: { type: ObjectId, ref: 'PlayerSchema' }
    , loser: { type: ObjectId, ref: 'PlayerSchema' }
    , level: {
        min: {
          kyu: Number
        , dan: Number
        }
      , max: {
          kyu: Number
        , dan: Number
        }
      }
  });
  var Game = null;


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
