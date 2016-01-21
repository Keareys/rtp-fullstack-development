'use strict';

var express = require('express');
var controller = require('./systememail.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/send', auth.isAuthenticated(), controller.send);
router.get('/list', auth.isAuthenticated(), controller.list);


module.exports = router;
