'use strict';

var express = require('express');
var controller = require('./feedback.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/create', auth.isAuthenticated(), controller.create);
router.get('/', auth.isAuthenticated(), controller.index);
router.post('/issues', auth.isAuthenticated(), controller.issues);

module.exports = router;
