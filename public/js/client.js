var joinGame
  , leaveGame
  , displayAvailableGames
  , addAvailableGame;

$(document).ready(function () {

  var games = io.connect('/games')
    , game = io.connect('/game')


  //games
  
  games.on('games:list', function(data) {
    displayAvailableGames(data, game);
  });

  displayAvailableGames = function(games) {
    $('#games_available').empty();
    games.forEach(function(game) {
      addAvailableGame(game);
    });
  };

  addAvailableGame = function(game) {
    $('#games_available').append(
      '<div>'+
        game.title+
        '<input type="button" value="Join" onClick="joinGame(\''+game._id+'\')">'+
      '</div>'
    );
  };


  //game

  joinGame = function(gameId) {
    game.emit('game:join', gameId);
  };

  leaveGame = function(gameId) {
    game.emit('game:leave', gameId);
  };

  game.on('game:joined', function(msg) {
    console.log(msg);
  });

  game.on('players:list', function(data) {
    console.log('players list :')
    console.log(data);
  });


  //events

  $('#leave_button').click(function(e) {
    console.log('leaving');
    socket.emit('leave_game');
  });

  $('#create_game_form').submit(function(e) {
    e.preventDefault();
    games.emit('game:new', {
      title: $('#title').val()
    , size: $('#size').val()
    });
  });

});
