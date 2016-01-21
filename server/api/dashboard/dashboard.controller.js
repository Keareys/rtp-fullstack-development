/**
 * ENDPOINT OVERVIEW
 * Summaries are calculated using crossfilter library
 * 
 * GET     /membership  -> /membership         returns an array of summarized message counts. 
 *                                             Table: dbo.Membership_VW
 *                                             Output: Total users, Inactive Users, Active Users
 * GET     /projects   -> /projects            returns an array of summarized project counts 
 *                                             Table: dbo.PROJECT_MAIN 
 *                                             Output: Number of projects, total draft projects, total CMA projects, all imported projects, total MTC not submitted, total MTC submitted, total Performance projects, total unmapped
 * GET     /errors ->  /erros                  returns a summary of application erros
 *                                             Table: dbo.Error_Log
 *                                             Output:  Number of errors, total unread errors, total read errors
 * GET     /sessions ->  /sessions             Returns summary of sessions 
 *                                             Table: dbo.sessions
 *                                             Output: Total sessions, online users
 * GET     /messages ->  /messages             Returns summary of message counts 
 *                                             Output: Total messages, total unread messages, total read messages
 */

'use strict';

var _ = require('lodash');
var sql = require('mssql');
var config = require('./../../config/environment');
var uuid = require('node-uuid');
var crossfilter = require('crossfilter');

// Get list of messages
exports.membership = function(req, res) {
    var request = new sql.Request(config.mssql.connection);
    var agency = req.user.agency;
    var role = req.user.role;
    var county = req.user.county;
    var queryString;

    if (agency === 'Metropolitan Transportation Commission (MTC)' && role === 'MTC Administrator') {
        queryString = 'Select * FROM dbo.Membership_VW Where Active in (0,1)';
    } else if (role === 'CMA Administrator') {
        queryString = "Select * FROM dbo.Membership_VW where County = '" + county + "' or Agency ='" + agency + "'";
    }

    request.query("SELECT * FROM dbo.Membership_VW", function(err, data) {
        if (err) {
            console.log(err);
            res.write(500, {
                "Content-Type": "text/plain"
            });
            res.write("Problem retrieving data" + err);
            return;
        }
        var userCrossfilter = crossfilter(data);

        //Registered User Statistics
        var numberOfUsers = userCrossfilter.size();

        //Dimensions
        var activeUsersDimension = userCrossfilter.dimension(function(d) {
            return d.Active;
        });

        // Total Active Users

        var groupByActiveUsers = activeUsersDimension.group().reduceCount();
        var groupedActiveUsers = groupByActiveUsers.top(2);
        var numberActiveUsers;
        var numberInactiveUsers;
        //Total Active Users
        if (groupedActiveUsers.length === 2) {
            numberActiveUsers = groupedActiveUsers[0].value;
            //Total Inactive Users
            numberInactiveUsers = groupedActiveUsers[1].value;

        } else {
            numberActiveUsers = groupedActiveUsers[0].value;
            //Total Inactive Users
            numberInactiveUsers = 0;
        }

        console.log("Total Users: " + numberOfUsers + ", Active Users: " + numberActiveUsers + ", Inactive Users: " + numberInactiveUsers);

        var userArray = [{
            "totalusers": numberOfUsers,
            "activeusers": numberActiveUsers,
            "inactiveusers": numberInactiveUsers
        }];

        res.json(userArray);

    });
};


exports.projects = function(req, res) {
    var role = req.user.role;
    var county = req.user.county;
    var agency = req.user.agency;
    console.log('running');
    console.log(role);
    var allImportedProjects;

    var request = new sql.Request(config.mssql.connection);

    if (role === 'MTC Administrator' || role === 'CMA Administrator' || role === "CMA") {

        var query;
        if (role === 'MTC Administrator') {
            query = "SELECT Project_ID, Sponsor_Status, MTC_Status, Performance_Status, Mapping_Status FROM dbo.PROJECT_MAIN where Sponsor_Status not in ('Deleted')";
        } else if (role === 'CMA' || role === 'CMA Administrator') {
            query = "SELECT Project_ID, Sponsor_Status, MTC_Status, Performance_Status, Mapping_Status FROM dbo.PROJECT_MAIN WHERE Sponsor_Status not in ('Deleted') AND (County = '" + req.user.county + "' OR Sponsor_Agency = '" + req.user.agency + "')";
        }
        console.log(query);
        request.query(query, function(err, data) {
            if (err) {
                console.log(err);
                res.write(500, {
                    "Content-Type": "text/plain"
                });
                res.write("Problem retrieving data" + err);
                return;
            }
            var projectsCrossFilter = crossfilter(data);

            //Registered User Statistics
            var numberOfProjects = projectsCrossFilter.size();
            console.log(numberOfProjects + " number of projects");

            //Dimensions
            //Sponsor Status Dimension
            var projectsDimenstion = projectsCrossFilter.dimension(function(d) {
                return d.Sponsor_Status;
            });
            //MTC Status Dimension
            var projectsMTC = projectsCrossFilter.dimension(function(d) {
                return d.MTC_Status;
            });

            var projectsPerformance = projectsCrossFilter.dimension(function(d) {
                return d.Performance_Status;
            });

            var projectsMapped = projectsCrossFilter.dimension(function(d) {
                return d.Mapping_Status;
            });


            //Filters Sponsor Status
            //Draft
            projectsDimenstion.filterExact("Draft");
            var totalDraftProjects = projectsDimenstion.top(Infinity).length;

            projectsDimenstion.filterAll();

            //Imported
            projectsDimenstion.filterExact("Imported");
            var totalImportedProjects = projectsDimenstion.top(Infinity).length;
            projectsDimenstion.filterAll();

            //Imported CMA
            projectsDimenstion.filterExact("Imported CMA");
            var totalImportedProjectsCMA = projectsDimenstion.top(Infinity).length;
            projectsDimenstion.filterAll();

            //Needs Information
            projectsDimenstion.filterExact("Needs Information");
            var needsInformationProjects = projectsDimenstion.top(Infinity).length;
            console.log('needs information + ' + needsInformationProjects);
            projectsDimenstion.filterAll();

            //Needs Information CMA
            projectsDimenstion.filterExact("Needs Information CMA");
            var needsInformationCMAProjects = projectsDimenstion.top(Infinity).length;
            projectsDimenstion.filterAll();

            //Submitted to CMA
            projectsDimenstion.filterExact("Submitted to CMA");
            var totalCMAProjects = projectsDimenstion.top(Infinity).length;
            projectsDimenstion.filterAll();

            //Filters MTC STATUS
            projectsMapped.filterFunction(function(d) {
                return d === "Not Yet Mapped";
            });
            var totalunmapped = projectsMapped.top(Infinity).length;
            projectsMapped.filterAll();


            //Filters MTC STATUS
            projectsMTC.filterFunction(function(d) {
                return d === "Not Submitted";
            });
            var totalMTCNotSubmitted = projectsMTC.top(Infinity).length;
            projectsMTC.filterAll();

            //Performance Projects
            projectsPerformance.filterFunction(function(d) {
                return d === 'Needs Evaluation';
            });

            var totalPerformanceProjects = projectsPerformance.top(Infinity).length;
            projectsPerformance.filterAll();

            projectsMTC.filterAll();
            projectsMTC.filterFunction(function(d) {
                return d === "Submitted";
            });
            var totalMTCSubmitted = projectsMTC.top(Infinity).length;
            if (role === 'CMA Administrator' || role === 'CMA User' || 'MTC Administrator') {
                allImportedProjects = totalImportedProjects + totalImportedProjectsCMA + needsInformationProjects + needsInformationCMAProjects;
            } else {
                allImportedProjects = totalImportedProjects + needsInformationProjects;
            }

            var projectsArray = [{
                "totalprojects": numberOfProjects,
                "projects_draft": totalDraftProjects,
                "cma_submitted": totalCMAProjects,
                "projects_imported": allImportedProjects,
                "mtc_notsubmitted": totalMTCNotSubmitted,
                "mtc_submitted": totalMTCSubmitted,
                "total_performance": totalPerformanceProjects,
                "totalunmapped": totalunmapped
            }];

            res.json(projectsArray);

        });
    } else {
        request = new sql.Request(config.mssql.connection);
        console.log('running sponsor');
        request.query("SELECT Project_ID,Sponsor_Status, MTC_Status FROM dbo.PROJECT_MAIN WHERE createSponsorCode = '" + agency + "' AND Sponsor_Status not in ('Deleted')", function(err, data) {
            if (err) {
                console.log(err);
                res.write(500, {
                    "Content-Type": "text/plain"
                });
                res.write("Problem retrieving data" + err);
                return;
            }
            var projectsCrossFilter = crossfilter(data);

            //Registered User Statistics
            var numberOfProjects = projectsCrossFilter.size();

            //Dimensions
            //Sponsor Status Dimension
            var projectsDimenstion = projectsCrossFilter.dimension(function(d) {
                return d.Sponsor_Status;
            });

            var projectsMTC = projectsCrossFilter.dimension(function(d) {
                return d.MTC_Status;
            });


            //Filters Sponsor Status
            //Draft
            projectsDimenstion.filterExact("Draft");
            var totalDraftProjects = projectsDimenstion.top(Infinity).length;

            projectsDimenstion.filterAll();

            //Imported
            projectsDimenstion.filterExact("Imported");
            var totalImportedProjects = projectsDimenstion.top(Infinity).length;
            projectsDimenstion.filterAll();

            //Needs Information
            projectsDimenstion.filterExact("Needs Information");
            var needsInformationProjects = projectsDimenstion.top(Infinity).length;
            projectsDimenstion.filterAll();

            //Submitted to CMA
            projectsDimenstion.filterExact("Submitted to CMA");
            var totalCMAProjects = projectsDimenstion.top(Infinity).length;

            projectsDimenstion.filterAll();

            //Filters MTC STATUS
            projectsMTC.filterFunction(function(d) {
                return d === "Not Submitted";
            });

            var totalMTCNotSubmitted = projectsMTC.top(Infinity).length;

            projectsMTC.filterAll();

            projectsMTC.filterFunction(function(d) {
                return d === "Submitted";
            });

            var totalMTCSubmitted = projectsMTC.top(Infinity).length;
            var allImportedProjects = totalImportedProjects + needsInformationProjects;

            var projectsArray = [{
                "totalprojects": numberOfProjects,
                "projects_draft": totalDraftProjects,
                "projects_imported": allImportedProjects,
                "cma_submitted": totalCMAProjects,
                "mtc_notsubmitted": totalMTCNotSubmitted,
                "mtc_submitted": totalMTCSubmitted
            }];

            res.json(projectsArray);

        });
    }
};



exports.errors = function(req, res) {
    var request = new sql.Request(config.mssql.connection);
    var query = "SELECT * FROM dbo.Error_Log";

    request.query(query, function(err, data) {
        if (err) {
            console.log(err);
            res.write(500, {
                "Content-Type": "text/plain"
            });
            res.write("Problem retrieving data" + err);
            return;
        }

        // console.log(data);
        var errorCrossfilter = crossfilter(data);

        //Registered User Statistics
        var numberofErrors = errorCrossfilter.size();

        //Dimensions
        //Sponsor Status Dimension
        var errorsReadDimension = errorCrossfilter.dimension(function(d) {
            return d.Read_Flag;
        });


        //Filters Sponsor Status
        //Read
        errorsReadDimension.filterExact("1");
        var totalReadErrors = errorsReadDimension.top(Infinity).length;

        errorsReadDimension.filterAll();

        //Unread
        errorsReadDimension.filterExact("0");
        var totalUnreadErrors = errorsReadDimension.top(Infinity).length;
        errorsReadDimension.filterAll();


        var errorsArray = [{
            "totalErrors": numberofErrors,
            "totalUnreadErrors": totalUnreadErrors,
            "totalReadErrors": totalReadErrors


        }];

        res.json(errorsArray);

    });

};


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


exports.messages = function(req, res) {
    var role = req.user.role;
    var county = req.user.county;
    var agency = req.user.agency;
    var email = req.user.name;

    console.log(email);


    var request = new sql.Request(config.mssql.connection);
    var query;
    if (role === 'MTC Administrator') {
        query = "SELECT * FROM dbo.Correspondence_All_VW where To_User = '" + email + "'";
    } else if (role === 'CMA' || role === 'CMA Administrator') {
        query = "SELECT * FROM dbo.Correspondence_All_VW WHERE To_User = '" + email + "'";
    } else if (role === 'Sponsor' || role === 'Multi-County Sponsor') {
        query = "SELECT * FROM dbo.Correspondence_All_VW WHERE To_User = '" + email + "'";
    }
    request.query(query, function(err, data) {
        if (err) {
            console.log(err);
            res.write(500, {
                "Content-Type": "text/plain"
            });
            res.write("Problem retrieving data" + err);
            return;
        }
        // console.log(data);
        var messagesCrossfilter = crossfilter(data);

        //Registered User Statistics
        var numberofMessages = messagesCrossfilter.size();

        //Dimensions
        //Sponsor Status Dimension
        var messagesReadDimension = messagesCrossfilter.dimension(function(d) {
            return d.Read_Flag;
        });


        //Filters Sponsor Status
        //Read
        messagesReadDimension.filterExact("1");
        var totalReadMessages = messagesReadDimension.top(Infinity).length;

        messagesReadDimension.filterAll();

        //Unread
        messagesReadDimension.filterExact("0");
        var totalUnreadMessages = messagesReadDimension.top(Infinity).length;
        messagesReadDimension.filterAll();


        var messagesArray = [{
            "totalMessages": numberofMessages,
            "totalReadMessages": totalReadMessages,
            "totalUnreadMessages": totalUnreadMessages

        }];

        res.json(messagesArray);

    });
};





function handleError(res, err) {
    return res.status(500).send(err);
}
