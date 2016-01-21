'use strict';

var express = require('express');
var controller = require('./error.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();


router.get('/',auth.isAuthenticated(), controller.show);
router.post('/:id', auth.isAuthenticated(), controller.update);


module.exports = router;