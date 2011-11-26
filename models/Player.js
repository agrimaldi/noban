/**
 * Player model
 */
module.exports = function(app, conf) {

  var Schema        = app.db.Schema
    , ObjectId      = Schema.ObjectId
    , mongooseAuth  = app.modules.mongooseAuth;


  /**
   * Player Schema
   */
  var PlayerSchema = new Schema({
      name: {
        first: String
      , last: String
      }
    , login: String
    , email: { type: String, unique: true}
    , lastConnection: Date
    , joined: Date
    , level: {
        kyu: Number
      , dan: Number
      }
    , games: {
        won: [{ type: ObjectId, ref: 'GameSchema' }]
      , lost: [{ type: ObjectId, ref: 'GameSchema' }]
      , tie: [{ type: ObjectId, ref: 'GameSchema' }]
      , current: [{ type: ObjectId, ref: 'GameSchema' }]
      }
  });
  var Player = null;


  /**
   * MongooseAuth Plugin
   */
  PlayerSchema.plugin(mongooseAuth, {
    everymodule: {
      everyauth: {
        User: function() {
          return Player;
        }
      }
    }
  , password: {
      loginWith: 'login'
    , extraParams: {
        name: {
          first: String
        , last: String
        }
      , email: { type: String, unique: true }
      }
    , everyauth: {
        getLoginPath: '/login'
      , postLoginPath: '/login'
      , loginView: 'login.jade'
      , getRegisterPath: '/register'
      , postRegisterPath: '/register'
      , registerView: 'register.jade'
      , loginSuccessRedirect: '/'
      , registerSuccessRedirect: '/'
      }
    }
  });


  /**
   * Methods
   */
  PlayerSchema.statics.findByNick = function (nickname, callback) {
    return this.find({
      nickname: nickname
    }, callback);
  }

  PlayerSchema.methods.findStrongerOpponent = function (callback) {
    return this
      .where('kyulevel').lte(this.kyulevel)
      .where('danlevel').lte(this.danlevel)
      .run(callback);
  }


  /**
   * Define model.
   */
  Player = app.db.model('Player', PlayerSchema);


  /**
   * Return the Player model
   */
  return Player;

}
