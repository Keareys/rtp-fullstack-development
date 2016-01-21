'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PerformanceSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Performance', PerformanceSchema);