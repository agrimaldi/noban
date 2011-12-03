(function($) {

  var GameItem = Backbone.Model.extend({
    title: null
  , id: null
  });

  var GamesList = Backbone.Collection.extend({
    model: GameItem
  });

  var GameListView = Backbone.View.extend({
    el: $('#games_available')
  , socket: io.connect('/games')
  , events: {
      'submit create_game_form': 'createGame'
    }
  , initialize: function(){
      _.bindAll(this, 'render', 'createGame', 'appendItem');

      this.collection = new GamesList();
      this.collection.bind('add', this.appendItem);

      this.render();
    }
  , render: function(){
      $(this.el).append("<button id='add'>Add list item</button>");
      $(this.el).append("<ul></ul>");
      _(this.collection.models).each(function(item){
        appendItem(item);
      }, this);
    }
  , createGame: function() {
      console.log('im heere');
      this.socket.emit('newgame', {
        title: $('#title').val()
      , size: $('#size').val()
      });
    }
  , appendItem: function(item){
      $('ul', this.el).append("<li>"+item.get('part1')+" "+item.get('part2')+"</li>");
    }
  });

  var gameListView = new GameListView();

})(jQuery);
