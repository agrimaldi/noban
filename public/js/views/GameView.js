/**
 * GameList#View
 * 
 * This is the primary list of games. It recieves the collection
 * upon construction and will respond to events broadcasted from
 * socket.io. 
 */
var GameList = Backbone.View.extend({
  el: '#games_available'
, initialize: function(games) {
    _.bindAll(this, 'render', 'addGame', 'removeGame');
    this.games = games;
    // this is called upon fetch
    this.games.bind('reset', this.render);
    // this is called when the collection adds a new todo from the server
    this.games.bind('add', this.addGame);
    // this is called when the collection is told to remove a todo
    this.games.bind('remove', this.removeGame);
    this.render();
  }
, render: function () {
    var that = this;
    this.games.each(function (game) {
      that.addGame(game);
    });
    return this;
  }
, addGame: function (game) {
    var tdv = new Minimal.GameListItem(game);
    $(this.el).append(tdv.el);
  }
, removeGame: function (game) {
    var that = this;
    console.log('removeGame');
    console.log(game);
  }
});

/**
 * GameListItem#View
 * 
 * This view is created for each Game in the list.
 */
var GameListItem = Backbone.View.extend({
  className: 'game'
, socket: window.games
, events: {
    'click .join': 'joinGame'
  }
, initialize: function (model) {
    _.bindAll(this, 'joinGame');
    this.model = model;
    this.model.bind('joined');
    this.render();
  }
, render: function () {
    $(this.el).html(
      '<div>' +
        this.model.attributes.title +
        '<button class="join">Join</button>' +
      '</div>'
    );
    $(this.el).attr('id', this.model.attributes._id);
    return this;
  }
, joinGame: function () {
    this.model.save();
  }
});

/**
 * GameListForm#View
 * 
 * This form handles adding new Games to the server. The server
 * then broadcasts the new Game to all clients.
 */
var GameListForm = Backbone.View.extend({
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
    var Game = Game.extend({ noIoBind: true })
    var _game = new Game({
          title: this.$('#create_game_form input[name="title"]').val()
        , size: this.$('#create_game_form input[name="size"]').val()
        });
    this.$('#create_game_form input:not([type="submit"])').val('');
    _game.save();
    return false;
  }
});

