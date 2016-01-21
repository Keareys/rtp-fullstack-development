/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Systememail = require('./systememail.model');

exports.register = function(socket) {
  Systememail.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Systememail.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('systememail:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('systememail:remove', doc);
}