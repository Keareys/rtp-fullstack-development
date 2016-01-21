'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.post('/myaccount',auth.isAuthenticated(), controller.myAccount);
router.post('/mypwd',auth.isAuthenticated(), controller.myPwd);
router.post('/pwd/:id',auth.isAuthenticated(), controller.pwd);
router.post('/remove/:id',auth.isAuthenticated(), controller.destroy);

module.exports = router;
