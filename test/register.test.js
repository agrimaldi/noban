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
    'Creating test player': {
      topic: macros.create_player({
        name: {
          first: 'exis'
        , last: 'tant'
        }
      , login: 'existantregistered'
      , email: 'existantregistered@somewhere.com'
      }, 'password')

    , 'should provide a test player to the database': function(player) {
        player.should.have.property('login', 'existantregistered');
      }
    }
  })

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

    , 'with an unavailable login': {
        topic: macros.fill_submit({
          login: 'existantregistered'
        , password: 'password'
        , 'name.first': 'newregist'
        , 'name.last': 'erdplayer'
        , email: 'newregisteredplayer@dom.com'
        })

      , 'should respond with 200 OK': macros.assert_status(200)

      , 'should warn that the requested login is not available':  function(_, res, $) {
          $('ul#errors')
            .should.have.one('li.error', 'Someone already has claimed that login.')
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

      , 'should tell the new player he is logged in':  function(_, res, $) {
          $('ul#auth_msgs')
            .should.have.one('li.auth_msg', 'Authenticated')
        }
      , 'and finding the new player in the database': {
          topic: macros.find_player('newregisteredplayer')
        
        , 'should result in one hit': function(player) {
            should.exist(player);
          }
        }
      }
    }
  })

  .addBatch({
    'Finding the existant test player': {
      topic: macros.find_player('existantregistered')

    , 'and deleting it': function(player) {
        player.remove(this.callback);
      }
    , 'after it has been deleted': {
        topic: macros.find_player('existantregistered')

      , 'should yield no results': function(player) {
          should.not.exist(player);
        }
      }
    }
  , 'Finding the newly registerd player': {
      topic: macros.find_player('newregisteredplayer')

    , 'and deleting it': function(player) {
        player.remove(this.callback);
      }
    , 'after it has been deleted': {
        topic: macros.find_player('newregisteredplayer')

      , 'should yield no results': function(player) {
          should.not.exist(player);
        }
      }
    }
  })
  
  .export(module);
