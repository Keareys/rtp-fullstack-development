/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Error = require('./error.model');

exports.register = function(socket) {
  Error.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Error.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('error:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('error:remove', doc);
}