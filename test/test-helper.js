var should = require('should')
  , app = require('../app');

/**
 * API requests
 */
var api = {

  'get': function(browser, url) {
    return function() {
      browser.get(url, this.callback.bind(this, null));
    }
  },

  'post': function(browser, url, data) {
    return function() {
      data = JSON.stringify(data);
      browser.post(url, d, this.callback.bind(this, null));
    }
  }
}

/**
 * Helper Macros
 */
var macros = {
  
  'assert_status': function(code) {
    return function(_, res, $) {
      res.should.have.status(code);
    }
  }

, 'fill_submit': function(credentials) {
    return function(res, $) {
      $('form')
        .fill(credentials)
        .submit(this.callback.bind(this, null));
    }
  }

, 'create_player': function(info, pwd) {
    return function() {
      var player = new app.models.Player(info);
      player.password = pwd;
      player.save(this.callback);
    }
  }
, 'find_player': function(login) {
    return function() {
      app.models.Player.findOne({ login: login }, this.callback);
    }
  }
}

exports.api = api;
exports.macros = macros;
