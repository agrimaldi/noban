process.env['NODE_ENV'] = 'test';

var vows = require('vows')
  , tobi = require('tobi')
  , should = require('should')
  , api = require('./test-helper').api
  , macros = require('./test-helper').macros
  , app = require('../app')
  , browser = tobi.createBrowser(app);


vows
  .describe('Errors')

  .addBatch({
    'A page that does not exist': {
      topic: api.get(browser, '/notfound')

    , 'should respond with 404 NOT FOUND': macros.assert_status(404)
    }
  }).export(module);
