/**
 * Player model
 */
module.exports = function(app, conf) {
  var PlayerSchema  = require('./Schemas').PlayerSchema
    , ObjectId      = app.db.SchemaTypes.ObjectId
    , mongooseAuth  = app.modules.mongooseAuth
    , Player = null;


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
      , email: String
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