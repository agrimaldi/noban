process.env['NODE_ENV'] = 'test';

var vows = require('vows')
  , tobi = require('tobi')
  , should = require('should')
  , api = require('./test-helper').api
  , macros = require('./test-helper').macros
  , app = require('../app')
  , browser = tobi.createBrowser(app);


vows
  .describe('Login')

  .addBatch({
    'Creating test user': {
      topic: function() {
        var player = new app.models.Player({
          name: {
            first: 'exis'
          , last: 'tant'
          }
        , login: 'existant'
        , email: 'existant@somewhere.com'
        });
        player.password = 'password';
        player.save(this.callback);
      }

    , 'should provide a test user to the database': function(player) {
        player.should.have.property('login', 'existant');
      }
    }
  })

  .addBatch({
    'The login page': {
      topic: api.get(browser, '/login')

    , 'should respond with 200 OK': macros.assert_status(200)

    , 'should have a form': {
        topic: function(_, $) { return $('form'); }

      , 'that has a valid structure': function(form) {
          form
            .should.have.action('/login')
            .and.have.id('login_form')
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
      , 'that has a submit button': function(form) {
          form.find('> input[name=login-credentials]')
            .should.have.attr('type', 'submit');
        }
      }
    }
  })
  
  .addBatch({
    'Authenticating': {
      topic: api.get(browser, '/login')

    , 'with non existing login': {
        topic: macros.fill_submit({ login: 'nonexistant', password: 'random' })

      , 'should respond with 200 OK': macros.assert_status(200)

      , 'should display "User does not exist"': function(_, res, $) {
          var login = $('form > input=[name=login]').attr('value')
            , li = 'User with login ' + login + ' does not exist';
          $('ul#errors').should.have.one('li', li);
        }
      }
    , 'with a wrong password': {
        topic: macros.fill_submit({ login: 'existant', password: 'wrongpassword' })

      , 'should respond with 200 OK': macros.assert_status(200)

      , 'should display "Failed Login"': function(_, res, $) {
          $('ul#errors').should.have.one('li', 'Failed login.');
        }
      }
    }
  })

  .addBatch({
    'Deleting the test user': {
      topic: function() {
        var Player = app.models.Player;
        Player.findOne({ login: 'existant' }, this.callback);
      }

    , 'should properly delete the test user': function(player) {
        player.remove();
      }
    }
  })
  
  .export(module);
