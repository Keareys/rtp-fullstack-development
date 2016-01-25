/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/viewers', require('./api/viewer'));
  app.use('/api/mapping', require('./api/mapping'));
  app.use('/api/systememails', require('./api/systememail'));
  app.use('/api/feedback', require('./api/feedback'));
  app.use('/api/errors', require('./api/error'));
  app.use('/api/sessions', require('./api/session'));
  app.use('/api/dropdowns', require('./api/dropdown'));
  app.use('/api/contacts', require('./api/contact'));
  app.use('/api/performance', require('./api/performance'));
  app.use('/api/dashboard', require('./api/dashboard'));
  app.use('/api/status', require('./api/status'));
  app.use('/api/messages', require('./api/message'));
  app.use('/api/projects', require('./api/projects'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
