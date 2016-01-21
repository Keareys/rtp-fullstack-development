'use strict';

var express = require('express');
var controller = require('./performance.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/bundledProjects/:id', auth.isAuthenticated(), controller.bundledProjects);
router.get('/getPerformancePDAs/:id', auth.isAuthenticated(), controller.findPerformancePDAs);
router.get('/getPerformanceCOCs/:id', auth.isAuthenticated(), controller.findPerformanceCOCs);
router.get('/getPerformanceHOAs/:id', auth.isAuthenticated(), controller.findPerformanceHOAs);
router.get('/getPerformanceTPAs/:id', auth.isAuthenticated(), controller.findPerformanceTPAs);
router.post('/bundledProjectFeatures', auth.isAuthenticated(), controller.bundledProjectFeatures);
router.post('/showBundleProjects', auth.isAuthenticated(), controller.showBundleProjects);


module.exports = router;