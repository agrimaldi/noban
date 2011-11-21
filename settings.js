/**
 * Application Settings.
 */
module.exports = {
  port: 3000,
  hostname: '0.0.0.0',
  title: 'noban',
  session: {
    secret: 'hariom'
  },
  mongodb: {
    uri: {
      development: 'mongodb://localhost/noban_dev',
      test: 'mongodb://localhost/noban_test',
      production: 'mongodb://localhost/noban'
    }
  },
};
