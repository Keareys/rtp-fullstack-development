'use strict';

var express = require('express');
var controller = require('./dropdown.controller');
var auth = require('../../auth/auth.service');


var router = express.Router();

router.get('/counties', controller.counties);
router.get('/agencies', controller.agencies);
router.get('/roles', controller.roles);
router.get('/committedFunding', controller.committedFunding);


module.exports = router;