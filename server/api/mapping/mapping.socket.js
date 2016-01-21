/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Mapping = require('./mapping.model');

exports.register = function(socket) {
  Mapping.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Mapping.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('mapping:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('mapping:remove', doc);
}