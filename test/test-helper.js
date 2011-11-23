var verbs = {

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

exports.verbs = verbs;
