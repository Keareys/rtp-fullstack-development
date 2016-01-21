'use strict';

var express = require('express');
var controller = require('./status.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/:id', auth.isAuthenticated(), controller.update);
router.post('/mapstatus/:id', auth.isAuthenticated(), controller.updateMapStatus);

module.exports = router;
