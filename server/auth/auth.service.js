'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var validateJwt = expressJwt({
    secret: config.secrets.session
});

var sql = require('mssql');
var request = new sql.Request(config.mssql.connection);


/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
    return compose()
        // Validate jwt
        .use(function(req, res, next) {
            //console.log('running is authenticated');
            // allow access_token to be passed through query parameter as well
            if (req.query && req.query.hasOwnProperty('access_token')) {
                req.headers.authorization = 'Bearer ' + req.query.access_token;
            }
            validateJwt(req, res, next);
        })
        // Attach user to request
        .use(function(req, res, next) {
           // console.log('running add user to req');
           // console.log(req.user);
            var query = "Select * FROM dbo.Membership_VW where Membership_ID ='" + req.user.membershipid + "'";
           // console.log(query);
            request.query(query, function(err, user) {
                if (err) return next(err);
                if (!user) return res.status(401).send('Unauthorized');
                var newuser = {
                    'membershipid': user[0].Membership_ID,
                    'role': user[0].User_Role,
                    'name': user[0].Email,
                    'agency': user[0].Agency
                };
                req.user = newuser;
              //  console.log('the new req.user is');
              //  console.log(req.user);
                next();
            });

            // User.findById(req.user._id, function(err, user) {
            //     if (err) return next(err);
            //     if (!user) return res.status(401).send('Unauthorized');

            //     req.user = user;
            //     next();
            // });
        });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
    if (!roleRequired) throw new Error('Required role needs to be set');

    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
            if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
                next();
            } else {
                res.status(403).send('Forbidden');
            }
        });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
    console.log(id);
    console.log('is the signing id');
    return jwt.sign({
        membershipid: id
    }, config.secrets.session, {
        expiresIn: 60 * 90
    });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
    console.log('running setTokenCookie');
    if (!req.user) return res.status(404).json({
        message: 'Something went wrong, please try again.'
    });
    var token = signToken(req.user.membershipid, req.user.role);
    res.cookie('token', JSON.stringify(token));
    res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
