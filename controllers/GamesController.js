var _ = require('underscore');

/**
 * Games page Controller.
 */
var GamesController = function(app, conf) {
  var that    = this;

  that.app    = app;
  that.conf   = conf;
  that.io     = app.modules.io;
  that.io_games  = that.io.of('/games');
  that.io_game   = that.io.of('game');
  
  // Render games list
  app.get('/games', app.middlewares.mustBeLoggedIn, function(req, res) {
    res.render('games');
  });
  // Render basic view for a given game
  //app.get('/games/:id', app.middlewares.mustBeLoggedIn, function(req, res) {
    //res.render('game');
  //});
  
  // socket.io events
  that.games();
  that.game();

  // socket.io
      //req.app.models.Player.joinGame(gameId, function(err) {
      //});
      //socket.set('info', req.user, function() {
        //var players = io.of('/game').clients(gameId)
          //, players_info = _.pluck(_.pluck(_.pluck(players, 'store'), 'data'), 'info');
            //io
              //.of('/game')
              //.in(gameId)
              //.emit('players_list', players_info);
      //});
};


/**
 * socket.io for /games
 */
GamesController.prototype.games = function() {
  var that = this;
  that.io_games
    .on('connection', function(socket) {

      /**
       * games:read
       *
       * Called  when we .fetch() our collection
       * in the client-side router
       */
      socket.on('games:read', function(data, callback) {
        that.app.models.Game.findAvailable(function(err, games) {
          callback(null, games);
        });
      });
      
      /**
       * games:create
       *
       * Called  when we .save() a new game.
       */
      socket.on('game:create', function(data, callback) {
        var playerId = socket.handshake.session.auth.userId;
        that.app.models.Player.findById(playerId, function(err, player) {
          player.createGame(data, function(err, data) {
            that.io_games.emit('games:create', data);
            callback(null, data);
          });
        });
      });

      /**
       * games:update
       *
       * Handles any interaction with a game item.
       * For the moment, only handle joining.
       */
      socket.on('games:update', function(game) {
        var playerId = socket.handshake.session.auth.userId;
        that.app.models.Player.findById(playerId, function(err, player) {
          player.joinGame(game.id, function(err, data) {
            socket.join(game._id);
            that.io_games.emit('games/'+game._id+':update', data);
          });
        });
      });

    });
}

/**
 * socket.io for /game
 */
GamesController.prototype.game = function() {
  var that = this;
  that.io_game
    .on('connection', function(socket) {

      socket.on('game:leave', function(gameId) {
        var playerId = socket.handshake.session.auth.userId;
        that.app.models.Player.findById(playerId, function(err, player) {
          player.leaveGame(gameId);
        });
      });

    });
}



// Export a new instance of a RoomController.
module.exports = function(app, conf) {
  return new GamesController(app, conf);
};
