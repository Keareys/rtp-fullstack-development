/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });

  // Insert sockets below
  require('../api/viewer/viewer.socket').register(socket);
  require('../api/mapping/mapping.socket').register(socket);
  require('../api/systememail/systememail.socket').register(socket);
  require('../api/feedback/feedback.socket').register(socket);
  require('../api/error/error.socket').register(socket);
  require('../api/session/session.socket').register(socket);
  require('../api/dropdown/dropdown.socket').register(socket);
  require('../api/contact/contact.socket').register(socket);
  require('../api/performance/performance.socket').register(socket);
  require('../api/dashboard/dashboard.socket').register(socket);
  require('../api/status/status.socket').register(socket);
  require('../api/message/message.socket').register(socket);
  require('../api/projects/projects.socket').register(socket);
  require('../api/thing/thing.socket').register(socket);
}

module.exports = function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      console.info('[%s] DISCONNECTED', socket.address);
    });

    // Call onConnect.
    onConnect(socket);
    console.info('[%s] CONNECTED', socket.address);
  });
};