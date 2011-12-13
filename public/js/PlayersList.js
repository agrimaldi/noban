/*
*       MODELS
*
*   - Player    # Model
*   - Players   # Collection
*/

/**
 * Player#Model
 * 
 * The game model will bind to the servers `update` and
 * `delete` events. We broadcast these events on the completion
 * and removing of an event.
 * 
 * The `noIoBind` default value of false so that models that
 * are created via the collection are bound.
 * 
 */
var Player = Backbone.Model.extend({
  urlRoot: 'player'
, noIoBind: false
, socket: window.socket
, initialize: function () {
    this.id = this.attributes._id;
    _.bindAll(this, 'serverDelete', 'modelCleanup');
    if (!this.noIoBind) {
      this.ioBind('update', this.serverChange, this);
      this.ioBind('delete', this.serverDelete, this);
    }
  }
, serverDelete: function (data) {
    console.log('serverDelete');
    console.log(data);
    if (this.collection) {
      this.collection.remove(this);
    } else {
      this.trigger('remove', this);
    }
    this.modelCleanup();
  }
, modelCleanup: function () {
    this.ioUnbindAll();
    return this;
  }
});

/**
 * Players#Collection
 * 
 * The collection responds to `create` events from the 
 * server. When a new Player is created, the game is broadcasted
 * using socket.io upon creation.
 */
var Players = Backbone.Collection.extend({
  model: Player
, url: 'players'
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
*   - PlayerList      # View
*   - PlayerListItem  # View
*/

/**
 * PlayerList#View
 * 
 * This is the primary list of games. It recieves the collection
 * upon construction and will respond to events broadcasted from
 * socket.io. 
 */
var PlayerList = Backbone.View.extend({
  el: 'ul#players_list'
, initialize: function(players) {
    _.bindAll(this, 'render', 'addPlayer', 'removePlayer');
    this.players = players;
    this.players.bind('reset', this.render);
    this.players.bind('add', this.addPlayer);
    this.players.bind('remove', this.removePlayer);
    this.render();
  }
, render: function() {
    var that = this;
    this.players.each(function(player) {
      that.addPlayer(player);
    });
    return this;
  }
, addPlayer: function(player) {
    var tdv = new PlayerListItem(player);
    $(this.el).append(tdv.el);
  }
, removePlayer: function(player) {
    var that = this;
    console.log('removePlayer');
    console.log(player);
  }
});

/**
 * PlayerListItem#View
 * 
 * This view is created for each Player in the list.
 */
var PlayerListItem = Backbone.View.extend({
  className: 'player'
, initialize: function (model) {
    this.model = model;
    this.render();
  }
, render: function () {
    $(this.el).html(
      '<li>' +
        this.model.attributes.login +
      '</li>'
    );
    $(this.el).attr('id', this.model.attributes._id);
    return this;
  }
});

