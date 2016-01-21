/**
 * ENDPOINT OVERVIEW
 * Uses crossfilter library to calculate summaries
 * 
 * GET     sessions  -> /         returns an array of user emails for users with active sessions
 *                                Table: dbo.sessions
 *                                Output: Total users, Inactive Users, Active Users
 * GET     clear   -> /clear      Clears session table of all inactive sessions 
 *                                Stored Procedure: sp_ClearSessionsTbl @params None 
 */

'use strict';

var _ = require('lodash');
var Session = require('./session.model');
var sql = require('mssql');
var config = require('./../../config/environment');
var crossfilter = require('crossfilter');


// Get list of sessions
exports.sessions = function(req, res) {
    var role = req.user.role;
    var usersOnline = [];

    var request = new sql.Request(config.mssql.connection);
    var query = "SELECT * FROM dbo.sessions where session like '%\"user\"%'";

    request.query(query, function(err, data) {
        if (err) {
            console.log(err);
            res.write(500, {
                "Content-Type": "text/plain"
            });
            res.write("Problem retrieving data" + err);
            return;
        }

        // usersOnline.push(JSON.parse(data[0].session).passport.user);

        for (var i = data.length - 1; i >= 0; i--) {
            var userEmail = JSON.parse(data[i].session).passport.user;
            console.log(userEmail);
            //  console.log(usersOnline.indexOf(userEmail));

            if (usersOnline.indexOf(userEmail) === -1) {
                usersOnline.push(userEmail);
            }

        }
        //  console.log(usersOnline);
        // console.log(data);
        var sessionsCrossfilter = crossfilter(data);

        //Registered User Statistics
        var numberofSessions = sessionsCrossfilter.size();
        var sessionsArray = [{
            "totalSessions": numberofSessions,
            "onlineUsers": usersOnline

        }];

        res.json(sessionsArray);

    });
};



// Creates a new session in the DB.
exports.clear = function(req, res) {
    var request = new sql.Request(config.mssql.connection);
    request.execute('[dbo].[sp_ClearSessionsTbl]', function(err, recordsets, returnValue) {
        //console.log(err);
        console.log(returnValue);
        if (err)
            return next(err, null);
        if (returnValue === 0)
            res.end('Done!');

    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}
