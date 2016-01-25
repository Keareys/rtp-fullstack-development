'use strict';

var _ = require('lodash');
var Viewer = require('./viewer.model');

// Get list of viewers
exports.index = function(req, res) {
  Viewer.find(function (err, viewers) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(viewers);
  });
};

// Get a single viewer
exports.show = function(req, res) {
  Viewer.findById(req.params.id, function (err, viewer) {
    if(err) { return handleError(res, err); }
    if(!viewer) { return res.status(404).send('Not Found'); }
    return res.json(viewer);
  });
};

// Creates a new viewer in the DB.
exports.create = function(req, res) {
  Viewer.create(req.body, function(err, viewer) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(viewer);
  });
};

// Updates an existing viewer in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Viewer.findById(req.params.id, function (err, viewer) {
    if (err) { return handleError(res, err); }
    if(!viewer) { return res.status(404).send('Not Found'); }
    var updated = _.merge(viewer, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(viewer);
    });
  });
};

// Deletes a viewer from the DB.
exports.destroy = function(req, res) {
  Viewer.findById(req.params.id, function (err, viewer) {
    if(err) { return handleError(res, err); }
    if(!viewer) { return res.status(404).send('Not Found'); }
    viewer.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}