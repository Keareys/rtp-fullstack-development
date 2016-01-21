'use strict';

var express = require('express');
var controller = require('./dashboard.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/messages', auth.isAuthenticated(), controller.messages);
router.get('/projects', auth.isAuthenticated(), controller.projects);
// router.get('/totalprojects', auth.isAuthenticated(), controller.totalprojects);
router.get('/sessions', auth.isAuthenticated(), controller.sessions);
router.get('/errors', auth.isAuthenticated(), controller.errors);
router.get('/membership', auth.isAuthenticated(), controller.membership);


module.exports = router;
