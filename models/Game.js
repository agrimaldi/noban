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
    , created_at: { type: Date, default: Date.now }
    , size: Number
    , open: { type: Boolean, default: true }
    , finished: { type: Boolean, default: false }
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
  GameSchema.statics.findByTitle = function(title, callback) {
    return this.find({ title: title }, callback);
  }

  GameSchema.statics.findAvailable = function(callback) {
    return this.find({
      open: true
    , finished: false
    })
      .sort('creationDate', 'descending')
      .execFind(callback);
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
