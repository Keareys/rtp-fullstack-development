'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ViewerSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Viewer', ViewerSchema);