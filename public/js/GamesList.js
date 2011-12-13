/*
*       MODELS
*
*   - Game    # Model
*   - Games   # Collection
*/

/**
 * Game#Model
 * 
 * The game model will bind to the servers `update` and
 * `delete` events. We broadcast these events on the completion
 * and removing of an event.
 * 
 * The `noIoBind` default value of false so that models that
 * are created via the collection are bound.
 * 
 */
var Game = Backbone.Model.extend({
  urlRoot: 'game'
, noIoBind: false
, socket: window.socket
, initialize: function () {
    this.id = this.attributes._id;
    _.bindAll(this, 'serverChange', 'serverDelete', 'modelCleanup');
    if (!this.noIoBind) {
      this.ioBind('update', this.serverChange, this);
      this.ioBind('delete', this.serverDelete, this);
    }
  }
, serverChange: function (data) {
    data.fromServer = true;
    data.id = data._id;
    this.set(data);
    //window.location.pathname = '/games/#/' + data.id;
  }
, serverDelete: function (data) {
    console.log('serverDelete');
    console.log(data);
    //if (this.collection) {
      //this.collection.remove(this);
    //} else {
      //this.trigger('remove', this);
    //}
    this.modelCleanup();
  }
, modelCleanup: function () {
    this.ioUnbindAll();
    return this;
  }
});

/**
 * Games#Collection
 * 
 * The collection responds to `create` events from the 
 * server. When a new Game is created, the game is broadcasted
 * using socket.io upon creation.
 */
var Games = Backbone.Collection.extend({
  model: Game
, url: 'games'
, socket:window.socket
, initialize: function () {
    _.bindAll(this, 'serverCreate', 'collectionCleanup');
    this.ioBind('create', this.serverCreate, this);
  }
, serverCreate: function (data) {
    data.id = data._id;
    var exists = this.get(data.id);
    if (!exists) {
      this.add(data);
    } else {
      data.fromServer = true;
      exists.set(data);
    }
  }
, collectionCleanup: function (callback) {
    this.ioUnbindAll();
    this.each(function (model) {
      model.modelCleanup();
    });
    return this;
  }
});



/*
*       VIEWS
*
*   - GameList      # View
*   - GameListItem  # View
*   - GameListForm  # View
*/

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
    var tdv = new GameListItem(game);
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
        '<a href="games/#/blae">'+ this.model.attributes.title + '</a>' +
        //this.model.attributes.title +
        //'<button class="join">Join</button>' +
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

