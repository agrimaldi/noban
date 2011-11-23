var cluster     = require('cluster');
    settings    = require('./settings');

cluster('./app')
  .set('workers', 1)
  .use(cluster.logger('logs'))
  .use(cluster.stats())
  .use(cluster.pidfiles('pids'))
  .use(cluster.cli())
  .use(cluster.reload())
  .listen(settings.port);
