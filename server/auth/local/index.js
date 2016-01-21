'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router.post('/', function(req, res, next) {
    //console.log('running authenticate');
    passport.authenticate('local', function(err, user, info) {
        console.log(info);
        var error = err || info;
        if (error) return res.status(401).json(error);
        if(info){
             return res.status(404).json({
            message: 'Your account has not yet been activated.'
        });
        }
        // if (!user) return res.status(404).json({
        //     message: 'Something went wrong, please try again.'
        // });

        var token = auth.signToken(user.membershipid, user.role);
       // console.log(token);
        res.json({
            token: token
        });
    })(req, res, next)
});

router.post('/register',
    passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/'
            // failureFlash: true
    })
);

module.exports = router;
