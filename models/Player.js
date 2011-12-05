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
    , joined: {type: Date, default: Date.now }
    , level: {
        kyu: { type: Number, default: 30 }
      , dan: { type:Number, default: 0 }
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
      , loginSuccessRedirect: '/games'
      , registerSuccessRedirect: '/account'
      }
    }
  });


  /**
   * Methods
   */
  PlayerSchema.statics.findByNick = function(nickname, callback) {
    return this.find({
      nickname: nickname
    }, callback);
  }

  PlayerSchema.methods.findStrongerOpponent = function(callback) {
    return this
      .where('kyulevel').lte(this.kyulevel)
      .where('danlevel').gte(this.danlevel)
      .run(callback);
  }

  PlayerSchema.methods.createGame = function(data, callback) {
    var that = this
      , game = new app.models.Game(data);
    game.creator = that;
    game.save(function(err) {
      callback(err, game);
    });
  }

  PlayerSchema.methods.joinGame = function(gameId, callback) {
    var that = this
      , idx = that.games.current.indexOf(gameId);
    if (idx === -1) {
      app.models.Game.findById(gameId, function(game) {
        console.log(game);
        console.log(game.players.black);
        console.log(game.players.white);
        console.log(game.players.waiting);
        //if (game.players.black = null)
      });
      that.games.current.push(gameId);
      //that.save(function(err) {
        //if (callback) callback(err);
      //});
    } else {
      if (callback) callback(err);
    }
  }

  PlayerSchema.methods.leaveGame = function(gameId, callback) {
    var that = this
      , idx = that.games.current.indexOf(gameId);
    if (idx != -1) {
      that.games.current.splice(idx, 1);
    }
    that.save(function(err) {
      // TODO: if player is game creator, delete the game
      callback(err);
    });
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
