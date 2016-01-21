'use strict';

var express = require('express');

var controller = require('./projects.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/listNames', auth.isAuthenticated(), controller.listNames);
router.get('/', auth.isAuthenticated(), controller.index);
router.get('/detail/:id', auth.isAuthenticated(), controller.showDetail);
router.get('/mapdetail/:id', auth.isAuthenticated(), controller.showMapDetail);
router.get('/projectList/:id', auth.isAuthenticated(), controller.projectList);
router.get('/committedFunding/:id', auth.isAuthenticated(), controller.committedFunding);
router.post('/insertList', auth.isAuthenticated(), controller.insertList);
router.post('/insertIntoList', auth.isAuthenticated(), controller.insertIntoList);
router.post('/removeList/:id', auth.isAuthenticated(), controller.removeList);
router.post('/removeFromList/:id', auth.isAuthenticated(), controller.removeFromList);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.get('/modelingfiles/:id', auth.isAuthenticated(), controller.modelingFiles);
router.post('/feature/:id', auth.isAuthenticated(), controller.updateMapFeature);
router.post('/addfeature/:id', auth.isAuthenticated(), controller.addMapFeature);
router.post('/tooltype/:id', auth.isAuthenticated(), controller.updateToolType);
router.get('/emails/:id', auth.isAuthenticated(), controller.emails);
router.post('/updateProjectContacts/:id', auth.isAuthenticated(), controller.updateProjectContacts);
router.post('/updateProjectCostSchedule/:id', auth.isAuthenticated(), controller.updateProjectCostSchedule);
router.post('/updateProjectDetailCost/:id', auth.isAuthenticated(), controller.updateProjectDetailCost);
router.post('/updateProjectFunding/:id', auth.isAuthenticated(), controller.updateProjectFunding);
router.post('/updateProjectGeneral/:id', auth.isAuthenticated(), controller.updateProjectGeneral);
router.post('/updateProjectModeling/:id', auth.isAuthenticated(), controller.updateProjectModeling);

module.exports = router;
