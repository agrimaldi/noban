/**
 * TodoList#View
 * 
 * This is the primary list of todos. It recieves the collection
 * upon construction and will respond to events broadcasted from
 * socket.io. 
 */

var GameList = Backbone.View.extend({
  el: '#games_available',
  initialize: function(games) {
    _.bindAll(this, 'render', 'addGame', 'removeGame');
    
    this.games = games;
    
    // this is called upon fetch
    this.games.bind('reset', this.render);
    
    // this is called when the collection adds a new todo from the server
    this.games.bind('add', this.addGame);
    
    // this is called when the collection is told to remove a todo
    this.games.bind('remove', this.removeGame);
    
    this.render();
  },
  render: function () {
    var that = this;
    
    this.games.each(function (game) {
      that.addGame(game);
    });
    
    return this;
  },
  addGame: function (game) {
    var tdv = new Minimal.GameListItem(game);
    $(this.el).append(tdv.el);
  },
  removeGame: function (game) {
    var that = this;
    console.log('removeGame');
    console.log(game);
    
    // ooh, shiny animation!
    //this.$('#' + todo.id).css('width', width + 'px');
    //this.$('#' + todo.id).animate({
      //'margin-left': width,
      //'opacity': 0
    //}, 200, function () {
        //self.$('#' + todo.id).animate({
          //'height': 0
        //}, 200, function () {
            //self.$('#' + todo.id).remove();
          //});
      //});
  }
});

/**
 * TodoListItem#View
 * 
 * This view is created for each Todo in the list. It responds
 * to client interaction and handles displaying changes to todo model
 * received from the server.
 * 
 * In our case, it recieves a specific model on construction and 
 * binds to change events for whether the todo is completed or not. 
 */

var GameListItem = Backbone.View.extend({
  className: 'game',
  socket: window.games,
  events: {
    'click .join': 'joinGame'
    //'click .delete': 'deleteTodo'
  },
  initialize: function (model) {
    _.bindAll(this, 'joinGame', 'setStatus');
    this.model = model;
    this.model.bind('joined', this.setStatus);
    this.render();
  },
  render: function () {
    $(this.el).html(
      '<div>' +
        this.model.attributes.title +
        '<button class="join">Join</button>' +
      '</div>'
    );
    $(this.el).attr('id', this.model.attributes._id);
    this.setStatus();
    return this;
  },
  setStatus: function () {
    var status = this.model.get('completed');
    if (status) {
      $(this.el).addClass('complete');
    } else {
      $(this.el).removeClass('complete');
    }
  },
  joinGame: function () {
    // here we toggle the completed flag. we do NOT
    // set status (update UI) as we are waiting for
    // the server to instruct us to do so.
    //var status = this.model.get('completed');
    //this.model.save({ completed: !!!status });
    this.model.save();
  },
});
