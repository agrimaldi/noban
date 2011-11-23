var vows = require('vows')
  , tobi = require('tobi')
  , should = require('should')
  , api = require('./test-helper').api
  , macros = require('./test-helper').macros
  , browser = tobi.createBrowser(3000, '0.0.0.0');


vows.describe('Home').addBatch({

  'The home page': {
    topic: api.get(browser, '/'),

    'should respond with 200 OK': macros.assert_status(200)
  }
}).export(module);
