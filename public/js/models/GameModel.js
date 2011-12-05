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
 * Games#Collection
 * 
 * The collection responds to `create` events from the 
 * server. When a new Todo is created, the todo is broadcasted
 * using socket.io upon creation.
 */

var Games = Backbone.Collection.extend({
  model: Game,
  url: 'games',
  socket:window.socket,
  initialize: function () {
    _.bindAll(this, 'serverCreate', 'collectionCleanup');
    this.ioBind('create', this.serverCreate, this);
  },
  serverCreate: function (data) {
    data.id = data._id;
    var exists = this.get(data.id);
    if (!exists) {
      this.add(data);
    } else {
      data.fromServer = true;
      exists.set(data);
    }
  },
  collectionCleanup: function (callback) {
    this.ioUnbindAll();
    this.each(function (model) {
      model.modelCleanup();
    });
    return this;
  }
});
