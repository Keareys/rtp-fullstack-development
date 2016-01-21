'use strict';

var express = require('express');
var controller = require('./contact.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/messages', auth.isAuthenticated(), controller.messages);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);
module.exports = router;