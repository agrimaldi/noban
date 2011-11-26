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
      topic: macros.create_user({
        name: {
          first: 'exis'
        , last: 'tant'
        }
      , login: 'existant'
      , email: 'existant@somewhere.com'
      }, 'password')

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
    'Authenticating': {
      topic: api.get(browser, '/login')

    , 'with correct credentials': {
        topic: macros.fill_submit({ login: 'existant', password: 'password' })

      , 'should respond with 200 OK': macros.assert_status(200)

      , 'should redirect to /': function(_, res, $) {
        }
      , 'should inform the user he is logged in': function(_, res, $) {
          browser.text('h2').should.equal('Authenticated');
        }
      , 'should provide a way to log out': function(_, res, $) {
          $('a').should.have.attr('href', '/logout');
        }
      , 'and then logging out': {
          topic: api.get(browser, '/logout')

        , 'should respond with 200 OK': macros.assert_status(200)

        , 'should warn the user he is no longer authenticated': function(_, res, $) {
            browser.text('h2').should.equal('Not Authenticated');
          }
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
        player.remove(this.callback);
      }
    , 'and trying to find it again in the database': {
        topic: function() {
          var Player = app.models.Player;
          Player.findOne({ login: 'existant' }, this.callback);
        }

      , 'should result in no results': function(player) {
          should.not.exist(player);
        }
      }
    }
  })
  
  .export(module);
