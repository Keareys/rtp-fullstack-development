/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Viewer = require('./viewer.model');

exports.register = function(socket) {
  Viewer.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Viewer.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('viewer:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('viewer:remove', doc);
}