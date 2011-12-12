window.socket = io.connect('/games');
window.game_socket = io.connect('/game');

// We are going to put our app in the minimal namespace.
var Minimal = {};
Minimal.Games = Games;
Minimal.Game = Game;
Minimal.GameList = GameList;
Minimal.GameListItem = GameListItem;
Minimal.GameListForm = GameListForm;

/**
 * App#Router
 * 
 * There is only one route in this app. It creates the new 
 * Games Collection then passes it to the form and list views.
 * 
 * Then append the views to our page.
 */

Minimal.App = Backbone.Router.extend({
  routes: {
    '': 'index'
  , '/': 'index'
  , '/:id': 'game'
  }
, index: function () {
    var games = new Minimal.Games();
    var form = new Minimal.GameListForm(games);
    var list = new Minimal.GameList(games);
    games.fetch();
  }
, game: function(id) {
    console.log(id);
  }
});


// When the page is ready, create a new app and trigger the router.
$(document).ready(function() {
  window.app = new Minimal.App();
  Backbone.history.start();
});
