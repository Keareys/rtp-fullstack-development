'use strict';

var express = require('express');
var controller = require('./mapping.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();


router.post('/xy', controller.updateXY);
router.post('/lrs', controller.updateLRS);


module.exports = router;