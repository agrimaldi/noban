var vows = require('vows')
  , tobi = require('tobi')
  , should = require('should')
  , verbs = require('./test-helper').verbs
  , browser = tobi.createBrowser(3000, '0.0.0.0');


vows.describe('Home').addBatch({

  'The home page': {
    topic: verbs.get(browser, '/'),

    'should have a status of 200': function(_, res, $) {
      res.should.have.status(200);
    }
  }
}).export(module);
