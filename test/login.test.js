var vows = require('vows')
  , tobi = require('tobi')
  , should = require('should')
  , verbs = require('./test-helper').verbs
  , browser = tobi.createBrowser(3000, '0.0.0.0');


vows.describe('Login').addBatch({

  // Login form
  'The login page': {
    topic: verbs.get(browser, '/login'),

    'should have a status of 200': function(_, res, $) {
      res.should.have.status(200);
    },

    'should have a form': {
      topic: function(_, $) { return $('form'); },

      'that has a valid structure': function(form) {
        form
          .should.have.action('/login')
          .and.have.id('login_form')
          .and.have.method('post')
          .and.have.many('input');
      },

      'that has a login field': function(form) {
        form.find(' > input[name=login]')
          .should.have.attr('type', 'text');
      },

      'that has a password field': function(form) {
        form.find(' > input[name=password]')
          .should.have.attr('type', 'password');
      }
    }
  }
}).export(module);
