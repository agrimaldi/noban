process.env['NODE_ENV'] = 'test';

var vows = require('vows')
  , tobi = require('tobi')
  , should = require('should')
  , api = require('./test-helper').api
  , macros = require('./test-helper').macros
  , app = require('../app')
  , browser = tobi.createBrowser(app);


vows
  .describe('Register')



  .addBatch({
    'The register page': {
      topic: api.get(browser, '/register')

    , 'should respond with 200 OK': macros.assert_status(200)

    , 'should have a form': {
        topic: function(_, $) { return $('form'); }

      , 'that has a valid structure': function(form) {
          form
            .should.have.action('/register')
            .and.have.id('register_form')
            .and.have.method('post')
            .and.have.many('input');
        }
      , 'that has a login field': function(form) {
          form.find('> input[name=login]')
            .should.have.attr('type', 'text');
        }
      , 'that has a password field': function(form) {
          form.find('> input[name=password]')
            .should.have.attr('type', 'password');
        }
      , 'that has a first-name field': function(form) {
          form.find('> input[name="name.first"]')
            .should.have.attr('type', 'text');
        }
      , 'that has a last-name field': function(form) {
          form.find('> input[name="name.last"]')
            .should.have.attr('type', 'text');
        }
      , 'that has an email field': function(form) {
          form.find('> input[name=email]')
            .should.have.attr('type', 'email');
        }
      , 'that has a submit button': function(form) {
          form.find('> input[name=register-credentials]')
            .should.have.attr('type', 'submit');
        }
      }
    }
  })

  .addBatch({
    'Registering': {
      topic: api.get(browser, '/register')

    , 'with valid informations': {
        topic: macros.fill_submit({
          login: 'newregisteredplayer'
        , password: 'password'
        , 'name.first': 'newregist'
        , 'name.last': 'erdplayer'
        , email: 'newregisteredplayer@dom.com'
        })

      , 'should respond with 200 OK': macros.assert_status(200)

      , 'should redirect to /': function(_, res, $) {
        }
      , 'should tell the new player he is logged in':  function(_, res, $) {
          browser.text('h2').should.equal('Authenticated');
        }
      }
    }
  })

  .addBatch({
    'Deleting the test user': {
      topic: function() {
        var Player = app.models.Player;
        Player.findOne({ login: 'newregisteredplayer' }, this.callback);
      }

    , 'should properly delete the test user': function(player) {
        player.remove();
      }
    }
  })
  
  .export(module);
