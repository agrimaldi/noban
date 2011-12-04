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
    $('#main').prepend(form.el);
    
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
  id: 'create_game'
, events: {
    'click #create': 'createGame'
  }
, initialize: function(games) {
    console.log('inint');
    _.bindAll(this, 'createGame');
    this.games = games;
    this.render();
  }
, render: function() {
    console.log(this);
    console.log(this.el);
    console.log($(this.el));
    $(this.el).html(
      '<form id="create_game_form" method="post" name="create_game">'+
        '<input type="text" name="title" id="title" value="title" placeholder="title" required="required" class="create_game_field">'+
        '<input type="number" name="size" id="size" value="size" placeholder="19" required="required" class="create_game_field">'+
        '<input type="button" id="create" value="Create" class="create_game_field">'+
      '</form>'
    );
    return this;
  }
, createGame: function(e) {
    console.log('create');
    e.preventDefault();
    //var Game = Minimal.Game.extend({ noIoBind: true });
    //var attrs = {
      //title: this.$('#create_game_form input[name="title"]').val()
    //, size: this.$('#create_game_form input[name="size"]').val()
    //};
    ////this.$('#TodoInput input[name="TodoInput"]').val('');
    //var _game = new Game(attrs);
    //_game.save();
    return false;
  }
});


// When the page is ready, create a new app and trigger the router.
$(document).ready(function() {
  window.app = new Minimal.App();
  Backbone.history.start();
});
