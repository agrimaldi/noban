var vows = require('vows')
  , tobi = require('tobi')
  , should = require('should')
  , verbs = require('./test-helper').verbs
  , browser = tobi.createBrowser(3000, '0.0.0.0');


vows.describe('Register').addBatch({

  // Register form
  'The register page': {
    topic: verbs.get(browser, '/register'),

    'should have a status of 200': function(_, res, $) {
      res.should.have.status(200);
    },

    'should have a form': {
      topic: function(_, $) { return $('form'); },

      'that has a valid structure': function(form) {
        form
          .should.have.action('/register')
          .and.have.id('register_form')
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
      },

      'that has a first-name field': function(form) {
        form.find(' > input[name="name.first"]')
          .should.have.attr('type', 'text');
      },

      'that has a last-name field': function(form) {
        form.find(' > input[name="name.last"]')
          .should.have.attr('type', 'text');
      },

      'that has an email field': function(form) {
        form.find(' > input[name=email]')
          .should.have.attr('type', 'email');
      },
    }
  }
}).export(module);
