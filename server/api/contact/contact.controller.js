/**
 * ENDPOINT OVERVIEW
 * 
 * GET     /index  -> /                        returns an array of messages based on user email. 
 *                                             Table: dbo.Correspondence_All_VW
 *                                             Fields: Project_ID, From_User, To_User, Message_Text, Message_Date, Read_Flag, Message_ID, Agency, Project_Title, To_User_County
 * GET     /messages   -> /:id                 returns aan array of messages based on Project_ID 
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


exports.messages = function(req, res) {
    var agency = req.user.agency;
    var role = req.user.role;
    var county = req.user.county;
    console.log(agency);
    var queryString;

    if (agency === "Metropolitan Transportation Commission (MTC)" && role === 'MTC Administrator') {
        queryString = "SELECT First_Name + ' ' + Last_Name + ' - ' + Agency as text, Membership_ID as value, Agency, Email FROM dbo.Membership_VW order by Agency, First_Name";
    } else {
        queryString = "SELECT First_Name + ' ' + Last_Name + ' - ' + Agency as text, Membership_ID as value, Agency, Email FROM dbo.Membership_VW WHERE Agency in ('Metropolitan Transportation Commission (MTC)','" + agency + "') OR County in ('" + county + "', 'Regional') order by Agency, First_Name";

    }
    var request = new sql.Request(config.mssql.connection);
    request.query(queryString, function(err, data) {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Got error :-( " + err);
            res.end("");
            return;
        }

        res.json(data);

    });
};


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
                console.log('email sent');

                res.json(data);

            });

    });
};


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
