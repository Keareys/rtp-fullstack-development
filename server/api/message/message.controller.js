/**
 * ENDPOINT OVERVIEW
 * 
 * GET     /index  -> /                        returns an array of messages based on user email. 
 *                                             Table: dbo.Correspondence_All_VW
 *                                             Fields: Project_ID, From_User, To_User, Message_Text, Message_Date, Read_Flag, Message_ID, Agency, Project_Title, To_User_County
 * GET     /show   -> /:id                     returns aan array of messages based on Project_ID 
 *                                             Table: dbo.Correspondence_All_VW
 *                                             Fields: Project_ID, From_User, To_User, Message_Text, Message_Date, Read_Flag, Message_ID, Agency, Project_Title, To_User_County
 * POST     /create ->  /:id                   returns a single project based on Project_ID. Used in project map view. 
 *                                             Stored Procedure: sp_InsertNewMessage @params Project_ID, To_User, From_User, Read_Flag, Message_ID, Message_Text
 *                                             Fields:  Project_ID, Update_Date, Updated_By, Project_Title, Project_Description, MAP_ID, Created_By, Feature_Type, Mapping_Status, RTP_ID, 
 *                                             Project_Notes, Modeling_Details, Mapping_Description, Modeling_Contact, First_Name, Last_Name, Email, Performance_Status, MTC_Status, WKT_WGS84, InPDA, InCOC, InHOA, InTPA, Tool_Type
 * PUT     /update ->  /:id                    Updates whether message has been read or not. 
 *                                             Stored Procedure: sp_UpdateMessageReadFlag @params = Message_ID, Read_Flag
 */


'use strict';

var _ = require('lodash');
var sql = require('mssql');
var config = require('./../../config/environment');
var uuid = require('node-uuid');
var sendgrid = require('sendgrid')(config.sendgrid.user, config.sendgrid.access);

// Get list of messages
exports.index = function(req, res) {
    //var projectid = req.param('projectid');
    //var agency = req.user.agency;
    //console.log(projectid);
    console.log('the messages user is');
    console.log(req.user);
    var request = new sql.Request(config.mssql.connection);
    request.query("SELECT * FROM dbo.Correspondence_All_VW WHERE To_User ='" + req.user.name + "' ORDER BY Read_Flag", function(err, data) {
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

//Get specific messages related to a project
exports.show = function(req, res) {
    var projectid = req.params.id;
    var agency = req.user.agency;
    console.log(projectid);
    var request = new sql.Request(config.mssql.connection);
    request.query("select * FROM dbo.Correspondence_All_VW WHERE Project_ID = '" + projectid + "'", function(err, data) {
        if (err) {
            console.log(err);
            res.write(500, {
                "Content-Type": "text/plain"
            });
            res.write("Problem retrieving data" + err);
            return;
        }
        console.log(data);
        res.json(data);

    });
};

//Create new message 
exports.create = function(req, res) {
    var id = req.body;
    console.log(id);
    var projectid = id.projectid;
    var messageid = uuid.v1();
    var request = new sql.Request(config.mssql.connection);
    request.input('Project_ID', sql.NVarChar(60), projectid);
    request.input('To_User', sql.NVarChar(255), id.toUser);
    request.input('From_User', sql.NVarChar(255), req.user.name);
    request.input('Read_Flag', sql.NVarChar(255), "0");
    request.input('Message_ID', sql.NVarChar(60), messageid);
    request.input('Message_Text', sql.NVarChar(sql.MAX), id.message);



    request.execute('[dbo].[sp_InsertNewMessage]', function(err, recordsets, returnValue) {
        //console.log(err);
        console.log(returnValue);
        if (err)
            return next(err, null);
        if (returnValue === 0)
            request.query("select * FROM dbo.Correspondence_All_VW where Message_ID = '" + messageid + "'", function(err, data) {
                if (err) {
                    console.log(err);
                    res.write(500, {
                        "Content-Type": "text/plain"
                    });
                    res.write("Problem retrieving data" + err);
                    return;
                }

                //Send email to user to notify them they have received a new message
                //send new user signup email to user
                console.log('sending email');
                // systememail.transport.sendMail({
                //     from: 'mziyam@mtc.ca.gov',
                //     to: id.toUser,
                //     subject: 'Plan Bay Area: New Message',
                //     text: 'You have received a new message concerning one of your projects. Please login to review the message and respond if necessary. (http://projects.planbayarea.org)'
                // });
                // 
                var email = new sendgrid.Email();
                email.addTo(id.toUser);
                email.subject = "Plan Bay Area: New Message";
                email.addCategory('rtp');
                email.from = 'support@planbayarea.org';
                email.replyto = 'support@planbayarea.org';
                email.text = 'Hi there!';
                email.html = '<h1>Message Content</h1> <br><h4>' + data[0].Message_Text + "</h4><br><br>Please login to the development site and respond if required.";

                // add filter settings one at a time
                email.addFilter('templates', 'enable', 1);
                email.addFilter('templates', 'template_id', 'ef9bd916-0a20-469a-8a24-d3846efd8b94');

                // or set a filter using an object literal.
                email.setFilters({
                    'templates': {
                        'settings': {
                            'enable': 1,
                            'template_id': 'ef9bd916-0a20-469a-8a24-d3846efd8b94',
                        }
                    }
                });

                sendgrid.send(email, function(err, json) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log(json);
                });
                console.log('email sent');

                res.json(data);

            });

    });
};

//Update read flag for specific message
exports.update = function(req, res) {

    var messageid = req.params.id;
    var request = new sql.Request(config.mssql.connection);
    request.input('Message_ID', sql.NVarChar(60), messageid);
    request.input('Read_Flag', sql.NVarChar(60), "1");

    request.execute('[dbo].[sp_UpdateMessageReadFlag]', function(err, recordsets, returnValue) {
        console.log(recordsets);
        //console.log(err);
        console.log(returnValue);
        if (err) {
            console.log(err);
            return next(err, null);
        }
        if (returnValue === 0)
            res.json([{
                'response': 'success'
            }]);
    });
};



function handleError(res, err) {
    return res.status(500).send(err);
}
