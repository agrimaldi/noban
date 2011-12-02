var async = require('async')
  , _ = require('underscore')
  , utils = require('../lib/utils');

/**
 * Games page Controller.
 */
var GamesController = function(app, conf) {
  var that    = this;

  that.app    = app;
  that.conf   = conf;
  that.io     = app.modules.io;
  that.games  = that.io.of('/games');
  that.game   = that.io.of('/game');
  
  // REST routes
  app.get('/games', app.middlewares.mustBeLoggedIn, that.index);
  
  // socket.io
  that.games
    .on('connection', function(socket) {
      that.refresh(socket);
      socket.on('newgame', function(data) {
        that.createGame(data);
      });
    });
  that.game
    .on('connection', function(socket) {
      socket.on('joingame', function(gameId) {
        that.joinGame(socket, gameId);
      });
      socket.on('leavegame', function(gameId) {
        that.leaveGame(socket, gameId);
      });
    });
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
 * Index Page.
 */
GamesController.prototype.index = function(req, res) {
  res.render('games');
};

/**
 * Create a new game
 */
GamesController.prototype.createGame = function(data) {
  var player = req.app.models.Player.findById(req.user._id, function(err, player) {
    player.createGame(data, function(err, game) {
      refresh(req.app);
    });
  });
};

/**
 * Join a game
 */
GamesController.prototype.joinGame = function(socket, gameId) {
  socket.join(gameId);
  socket.emit('gamejoined', "you've joined #" + gameId);
};

/**
 * Leave a game
 */
GamesController.prototype.leaveGame = function(socket, gameId) {
  socket.leave(gameId);
  socket.emit('gameleft', "you've left #" + gameId);
};

/**
 * Refresh available games
 */
GamesController.prototype.refresh = function(socket) {
  var that = this;
  that.app.models.Game.findAvailable(function(err, games) {
    that.games.emit('games', games);
  });
};


// Export a new instance of a RoomController.
module.exports = function(app, conf) {
  return new GamesController(app, conf);
};
