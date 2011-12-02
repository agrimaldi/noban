//$(document).ready(function () {
var games = io.connect('/games')
  , game = io.connect('/game')

var joinGame = function(gameId) {
  game.emit('joingame', gameId);
};

var leaveGame = function(gameId) {
  game.emit('leavegame', gameId);
};

var displayAvailableGames = function(games) {
  $('#games_available').empty();
  games.forEach(function(game) {
    addAvailableGame(game);
  });
};

var addAvailableGame = function(game) {
  $('#games_available').append(
    '<div>'+
      game.title+
      '<input type="button" value="Join" onClick="joinGame(\''+game._id+'\')">'+
    '</div>'
  );
};

games.on('games', function(data) {
  displayAvailableGames(data, game);
});

game.on('gamejoined', function(msg) {
  console.log(msg);
});

game.on('players_list', function(data) {
  console.log('players list :')
  console.log(data);
});

$('#leave_button').click(function(e) {
  console.log('leaving');
  socket.emit('leave_game');
});

$('#create_game_form').submit(function(e) {
  e.preventDefault();
  socket.emit('newgame', {
    title: $('#title').val()
  , size: $('#size').val()
  });
});
//});
