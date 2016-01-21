/**
 * ENDPOINT OVERVIEW
 * Used sendgrid API to send emails. Configuration is stored in local config file
 * https://github.com/sendgrid/sendgrid-nodejs
 * 
 * POST     send  -> /send                      Sends system email to application users and inserts email into sysemail table
 *                                              Table: dbo.AppMembership
 *                                              Stored Procedure: sp_InsertNewSysEmail 
 *                                              Params: EmailID, Title, Message, SentBy, Date
 * GET     list   -> /list                      returns an array of system emails
 *                                              Table: dbo.Sys_Email 
 *                                              Output:  ID, EmailID, Title, Message, SentBy, Date
 */


'use strict';

var _ = require('lodash');
var Systememail = require('./systememail.model');
var sql = require('mssql');
var config = require('./../../config/environment');
var sendgrid = require('sendgrid')(config.sendgrid.user, config.sendgrid.access);
var uuid = require('node-uuid');

// Send systememails
exports.send = function(req, res) {
    var id = req.body;
    console.log(id);
    var querystring;
    var emailid = uuid.v1();
    if (id.systemEmailTo === 'All Users') {
        querystring = 'SELECT Email FROM [dbo].[AppMembership]';
    } else {
        querystring = "SELECT Email FROM [dbo].[AppMembership] WHERE User_Role ='" + id.systemEmailTo + "'";
    }

    var email = new sendgrid.Email();
    email.setFrom(id.systemEmailFrom);
    email.setFromName('Adam Noelting');
    email.replyto = "anoelting@mtc.ca.gov";
    email.subject = id.systemTitle;
    email.addCategory(emailid);
    email.html = id.systemEmailBody;
    email.setFilters({
        'templates': {
            'settings': {
                'enable': 1,
                'template_id': 'ef9bd916-0a20-469a-8a24-d3846efd8b94',
            }
        }
    });



    var list = '';
    var request = new sql.Request(config.mssql.connection);

    request.query(querystring, function(err, emaillist) {
        // console.log(emaillist);
        if (err) {
            console.log(err);
        }

        for (var i = emaillist.length - 1; i >= 0; i--) {
            console.log(emaillist[i].Email);
            email.addTo(emaillist[i].Email);

        }
        // email.addTo('mziyam@mtc.ca.gov');

        sendgrid.send(email, function(err, json) {
            if (err) {
                return console.error(err);
            }
            console.log(json);
        });
    });

    request.input('EmailID', sql.NVarChar(60), emailid);
    request.input('Title', sql.NVarChar(255), id.systemTitle);
    request.input('Message', sql.NVarChar(255), id.systemEmailBody);
    request.input('SentBy', sql.NVarChar(255), req.user.name);
    request.input('Date', sql.Date, new Date());

    request.execute('[dbo].[sp_InsertNewSysEmail]', function(err, recordsets, returnValue) {
        //console.log(err);
        console.log(returnValue);
        if (err)
            return next(err, null);
        if (returnValue === 0)
            console.log('stored procedure');

        res.send('success');

    });
};

// Get list of  systememails
exports.list = function(req, res) {
    var request = new sql.Request(config.mssql.connection);
    request.query("select * FROM dbo.Sys_Email order by Date Desc", function(err, data) {
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




function handleError(res, err) {
    return res.status(500).send(err);
}
