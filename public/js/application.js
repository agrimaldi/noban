// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }
};

window.socket = io.connect('/games');

log(window.socket);

// We are going to put our app in the minimal namespace.
var Minimal = {};

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
    
    //var form = new Minimal.TodoListForm(todos);
    //$('#TodoWrapper').append(form.el);
    
    var list = new Minimal.GameList(games);
    $('#games_available').append(list.el);
    
    games.fetch();
  }
});

/**
 * Todo#Model
 * 
 * The todo model will bind to the servers `update` and
 * `delete` events. We broadcast these events on the completion
 * and removing of an event.
 * 
 * The `noIoBind` default value of false so that models that
 * are created via the collection are bound.
 * 
 */

Minimal.Game = Backbone.Model.extend({
  urlRoot: 'game',
  noIoBind: false,
  socket: window.socket,
  initialize: function () {
    this.id = this.attributes._id;
    _.bindAll(this, 'serverChange', 'serverDelete', 'modelCleanup');
    
    /*
     * if we are creating a new model to push to the server we don't want
     * to iobind as we only bind new models from the server. This is because
     * the server assigns the id.
     */
    if (!this.noIoBind) {
      this.ioBind('update', this.serverChange, this);
      this.ioBind('delete', this.serverDelete, this);
    }
  },
  serverChange: function (data) {
    // Useful to prevent loops when dealing with client-side updates (ie: forms).
    data.fromServer = true;
    console.log('serverChange');
    console.log(data);
    this.set(data);
  },
  serverDelete: function (data) {
    console.log('serverDelete');
    console.log(data);
    //if (this.collection) {
      //this.collection.remove(this);
    //} else {
      //this.trigger('remove', this);
    //}
    this.modelCleanup();
  },
  modelCleanup: function () {
    this.ioUnbindAll();
    return this;
  }
});


/**
 * Todos#Collection
 * 
 * The collection responds to `create` events from the 
 * server. When a new Todo is created, the todo is broadcasted
 * using socket.io upon creation.
 */

Minimal.Games = Backbone.Collection.extend({
  model: Minimal.Game,
  url: 'games',
  socket:window.socket,
  initialize: function () {
    _.bindAll(this, 'serverCreate', 'collectionCleanup');
    this.ioBind('create', this.serverCreate, this);
  },
  serverCreate: function (data) {
    // make sure no duplicates, just in case
    console.log('serverCreate');
    console.log(data);
    //var exists = this.get(data.id);
    //if (!exists) {
      //this.add(data);
    //} else {
      //data.fromServer = true;
      //exists.set(data);
    //}
  },
  collectionCleanup: function (callback) {
    this.ioUnbindAll();
    this.each(function (model) {
      model.modelCleanup();
    });
    return this;
  }
});

/**
 * TodoList#View
 * 
 * This is the primary list of todos. It recieves the collection
 * upon construction and will respond to events broadcasted from
 * socket.io. 
 */

Minimal.GameList = Backbone.View.extend({
  id: 'games_available',
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
    console.log('addGame');
    console.log(game);
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

Minimal.GameListItem = Backbone.View.extend({
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

/**
 * TodoListForm#View
 * 
 * This form handles adding new Todos to the server. The server
 * then broadcasts the new Todo to all clients. We don't want our 
 * new Model instance to ioBind as no ID has been defined so we 
 * extend our original model and toggle our flag.
 */

//Minimal.TodoListForm = Backbone.View.extend({
  //id: 'TodoForm',
  //events: {
    //'click .button#add': 'addTodo'
  //},
  //initialize: function (todos) {
    //_.bindAll(this, 'addTodo');
    //this.todos = todos;
    //this.render();
  //},
  //render: function () {
    //$(this.el).html(template.form());
    //return this;
  //},
  //addTodo: function () {
    //// We don't want ioBind events to occur as there is no id.
    //// We extend Todo#Model pattern, toggling our flag, then create
    //// a new todo from that.
    //var Todo = Minimal.Todo.extend({ noIoBind: true });
    
    //var attrs = {
      //title: this.$('#TodoInput input[name="TodoInput"]').val(),
      //completed: false
    //};
    
    //// reset the text box value
    //this.$('#TodoInput input[name="TodoInput"]').val('');
    
    //var _todo = new Todo(attrs);
    //_todo.save();
  //}
//});

// When the page is ready, create a new app and trigger the router.
$(document).ready(function () {
  window.app = new Minimal.App();
  Backbone.history.start();
});
