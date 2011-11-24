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
      topic: api.get(browser, '/'),

      'should respond with 200 OK': macros.assert_status(200)
    }
  }).export(module);
