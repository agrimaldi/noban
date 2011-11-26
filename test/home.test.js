process.env['NODE_ENV'] = 'test';

var vows = require('vows')
  , tobi = require('tobi')
  , should = require('should')
  , api = require('./test-helper').api
  , macros = require('./test-helper').macros
  , app = require('../app')
  , browser = tobi.createBrowser(app);


vows
  .describe('Home')

  .addBatch({
    'The home page': {
      topic: api.get(browser, '/')

    , 'should respond with 200 OK': macros.assert_status(200)

    , ', when not authenticated, ': {
        topic: function(_, $) { return $; }

      , 'should provide a way to login': function($) {
          $('#auth_actions')
            .should.have.one('#password-login');
          $('#password-login')
            .should.have.one('a');
          $('#password-login > a')
            .should.have.attr('href', '/login');
        }
      , 'should provide a way to register': function($) {
          $('#auth_actions')
            .should.have.one('#register');
          $('#register')
            .should.have.one('a');
          $('#register > a')
            .should.have.attr('href', '/register');
        }
      , 'should not provide a way to logout': function($) {
          $('#auth_actions')
            .should.not.have.one('#logout');
        }
      }
    }
  }).export(module);
