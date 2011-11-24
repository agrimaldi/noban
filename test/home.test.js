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
          $('#password-login').should.have.one('a');
          should.equal($('#password-login > a').attr('href'), '/login');
        }
      , 'should provide a way to register': function($) {
          $('#register').should.have.one('a');
          should.equal($('#register > a').attr('href'), '/register');
        }
      }
    }
  }).export(module);
