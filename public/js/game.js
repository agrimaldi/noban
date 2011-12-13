window.socket = io.connect('/game');


/**
 * App#Router
 * 
 * There is only one route in this app. It creates the new 
 * Games Collection then passes it to the form and list views.
 * 
 * Then append the views to our page.
 */

var Application = Backbone.Router.extend({
  routes: {
    '': 'index'
  , '/': 'index'
  }
, index: function () {
    var players = new Players();
    var PlayersList = new PlayerList(players);
    players.fetch({ data: window.location.pathname.split('/')[2] });
  }
});


// When the page is ready, create a new app and trigger the router.
$(document).ready(function() {
  window.application = new Application();
  Backbone.history.start();
});
