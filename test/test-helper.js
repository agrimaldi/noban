var should = require('should');

/**
 * API requests
 */
var api = {

  'get': function(browser, url) {
    return function() {
      browser.get(url, this.callback.bind(this, null));
    }
  },

  'post': function(browser, url) {
    return function() {
      browser.post(url, this.callback.bind(this, null));
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
}

exports.api = api;
exports.macros = macros;
