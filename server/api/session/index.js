'use strict';

var express = require('express');
var controller = require('./session.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.sessions);
router.get('/clear', auth.isAuthenticated(), controller.clear);


module.exports = router;
