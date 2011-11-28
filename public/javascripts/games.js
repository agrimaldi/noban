var displayGames = function(games) {
  $('ul#games_list').empty();
  games.forEach(function(game) {
    appendList($('ul#games_list'), '<a href="'+game._id+'">'+game.title);
  });
}

var appendList = function(ul, li) {
  ul.append('<li>'+li+'</li>');
}

$(document).ready(function () {
  var socket = io.connect();
  socket.on('games', function(data) {
    displayGames(data);
  });
});
