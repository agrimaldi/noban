window.socket = io.connect('/games');

// We are going to put our app in the minimal namespace.
var Minimal = {};
Minimal.Games = Games;
Minimal.Game = Game;
Minimal.GameList = GameList;
Minimal.GameListItem = GameListItem;

/**
 * App#Router
 * 
 * There is only one route in this app. It creates the new 
 * Todos Collection then passes it to the form and list views.
 * 
 * Then append the views to our page.
 */

Minimal.App = Backbone.Router.extend({
  routes: {
    '': 'index'
  , '/': 'index'
  }
, index: function () {
    var games = new Minimal.Games();
    
    var form = new Minimal.GameListForm(games);
    //$('#main').prepend(form.el);
    
    var list = new Minimal.GameList(games);
    //$('#main').append(list.el);
    
    games.fetch();
  }
});


/**
 * TodoListForm#View
 * 
 * This form handles adding new Todos to the server. The server
 * then broadcasts the new Todo to all clients. We don't want our 
 * new Model instance to ioBind as no ID has been defined so we 
 * extend our original model and toggle our flag.
 */

Minimal.GameListForm = Backbone.View.extend({
  el: '#create_game'
, events: {
    'submit #create_game_form': 'createGame'
  }
, initialize: function(games) {
    _.bindAll(this, 'createGame');
    this.games = games;
    this.render();
  }
, render: function() {
    return this;
  }
, createGame: function() {
    var Game = Minimal.Game.extend({ noIoBind: true })
      , _game = new Game({
          title: this.$('#create_game_form input[name="title"]').val()
        , size: this.$('#create_game_form input[name="size"]').val()
        });
    this.$('#create_game_form input:not([type="submit"])').val('');
    _game.save();
    return false;
  }
});


// When the page is ready, create a new app and trigger the router.
$(document).ready(function() {
  window.app = new Minimal.App();
  Backbone.history.start();
});
