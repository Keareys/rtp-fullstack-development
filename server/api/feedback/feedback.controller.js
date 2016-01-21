/**
 * ENDPOINT OVERVIEW
 * 
 * 
 * GET     create  -> /create      inserts new feedback into the feedback table. 
 *                                 Stored Procedure: sp_InsertNewFeedback @params name, email, contactid, apppage, feedbacktype, comment
 * GET     index   -> /            returns an array of feedback entries 
 *                                 Table: dbo.dbo.APPFEEDBACK 
 *                                 Output:  recid, name, email, contactid, sessid, feedbacktype, apppage, comment, priority, status, devcomment, updatedate, issues
 * GET     issues ->  /issues      Updates issues flag to 1 and adds item to Github issues
 *                                 Stored procedure: sp_UpdateIssuesFlag @params recid, issues
 *                                 Github:  connects via octonode library. Connection information stored in local config
 */


'use strict';

var _ = require('lodash');
var sql = require('mssql');
var config = require('./../../config/environment');
var github = require('octonode');

var client = github.client({
    username: config.github.user,
    password: config.github.access
});

var ghrepo = client.repo('MetropolitanTransportationCommission/rtp-fullstack');

// Get list of counties
exports.create = function(req, res) {
    var id = req.body;
    console.log(id);
    var request = new sql.Request(config.mssql.connection);
    var query = "Select County FROM [dbo].[Agency_LU] Group by County";

    request.input('name', sql.NVarChar(60), id.fullName);
    request.input('email', sql.NVarChar(255), id.email);
    request.input('contactid', sql.NVarChar(255), req.user.contactid);
    request.input('apppage', sql.NVarChar(60), id.page);
    request.input('feedbacktype', sql.NVarChar(60), id.category);
    request.input('comment', sql.NVarChar(255), id.comment);

    request.execute('[dbo].[sp_InsertNewFeedback]', function(err, recordsets, returnValue) {
        //console.log(err);
        console.log(returnValue);
        if (err)
            return handleError()(res, err);
        if (returnValue === 0) {
           
            res.json({
                response: 'success'
            });
        }

    });

};

// Get list of feedback
exports.index = function(req, res) {
    var request = new sql.Request(config.mssql.connection);
    request.query("SELECT * FROM dbo.APPFEEDBACK ORDER BY updatedate", function(err, data) {
        if (err) {
            console.log(err);
            res.write(500, {
                "Content-Type": "text/plain"
            });
            res.write("Problem retrieving data" + err);
            return;
        }

        res.json(data);

    });
};

// Add to issues
exports.issues = function(req, res) {
    var id = req.body;
    console.log(id);
    var request = new sql.Request(config.mssql.connection);

    request.input('recid', sql.NVarChar(60), id.recid);
    request.input('issues', sql.NVarChar(255), 1);

    request.execute('[dbo].[sp_UpdateIssuesFlag]', function(err, recordsets, returnValue) {
        console.log(returnValue);
        console.log(recordsets);
        if (err)
            return handleError()(res, err);
        if (returnValue === 0) {

            ghrepo.issue({
                "title": id.page,
                "body": id.comment,
                "assignee": "MTCGIS",
                // "milestone": 'Misc.',
                "labels": ["Feedback"]
            }, function(callback) {
                console.log(callback);
                res.json({
                    response: 'success'
                });
            }); //issue

        }

    });

};



function handleError(res, err) {
    return res.status(500).send(err);
}
