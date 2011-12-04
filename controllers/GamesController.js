  var _ = require('underscore');

/**
 * Games page Controller.
 */
var GamesController = function(app, conf) {
  var that    = this;

  that.app    = app;
  that.conf   = conf;
  that.io     = app.modules.io;
  that.games  = that.io.of('/games');
  //that.game   = that.io.of('game');
  
  // REST routes
  app.get('/games', app.middlewares.mustBeLoggedIn, that.index);
  
  that.gamesPage();
  //that.gamePage();

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
 * Index Page.
 */
GamesController.prototype.index = function(req, res) {
  res.render('games');
};

/**
 * socket.io for /games
 */
GamesController.prototype.gamesPage = function() {
  var that = this;
  that.games
    .on('connection', function(socket) {

      socket.on('games:read', function(data, callback) {
        that.app.models.Game.findAvailable(function(err, games) {
          callback(null, games);
        });
      });
      
      // New Game
      socket.on('game:create', function(data) {
        console.log(data);
        //that.createGame(socket, data);
      });

      // Join Game
      socket.on('games:update', function(data) {
        that.joinGame(socket, data.id);
      });

    
    });
}

/**
 * socket.io for /game
 */
GamesController.prototype.gamePage = function() {
  var that = this;
  that.game
    .on('connection', function(socket) {
      // Leave Game
      socket.on('game:leave', function(gameId) {
        that.leaveGame(socket, gameId);
      });
    });
}

/**
 * Create a new game
 */
GamesController.prototype.createGame = function(socket, data) {
  var that = this
    , playerId = socket.handshake.session.auth.userId;
  that.app.models.Player.findById(playerId, function(err, player) {
    player.createGame(data, function(err, gameId) {
      console.log(gameId);
    });
  });
};

/**
 * Join a game
 */
GamesController.prototype.joinGame = function(socket, gameId) {
  var that = this
    , playerId = socket.handshake.session.auth.userId;
  that.app.models.Player.findById(playerId, function(err, player) {
    player.joinGame(gameId);
  });
  socket.join(gameId);
};

/**
 * Leave a game
 */
GamesController.prototype.leaveGame = function(socket, gameId) {
  var that = this
    , playerId = socket.handshake.session.auth.userId;
  that.app.models.Player.findById(playerId, function(err, player) {
    player.leaveGame(gameId);
  });
  socket.leave(gameId);
  socket.emit('game:left', "you've left #" + gameId);
};

/**
 * Refresh available games
 */
//GamesController.prototype.refresh = function(socket) {
  //var that = this;
  //that.app.models.Game.findAvailable(function(err, games) {
    //that.games.emit('games', games);
  //});
//};


// Export a new instance of a RoomController.
module.exports = function(app, conf) {
  return new GamesController(app, conf);
};
