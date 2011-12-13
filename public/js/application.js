window.socket = io.connect('/games');


/**
 * App#Router
 * 
 * There is only one route in this app. It creates the new 
 * Games Collection then passes it to the form and list views.
 * 
 * Then append the views to our page.
 */

var Application = Backbone.Router.extend({
  routes: {
    '': 'index'
  , '/': 'index'
  //, '/:id': 'game'
  }
, index: function () {
    var games = new Games();
    var form = new GameListForm(games);
    var gamesList = new GameList(games);
    games.fetch();
  }
//, game: function(id) {
    //var players = new Players();
    //var playersList = new PlayerList(players);
    //players.fetch();
  //}
});


// When the page is ready, create a new app and trigger the router.
$(document).ready(function() {
  window.application = new Application();
  Backbone.history.start();
});
