/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Projects = require('./projects.model');

exports.register = function(socket) {
  Projects.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Projects.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('projects:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('projects:remove', doc);
}