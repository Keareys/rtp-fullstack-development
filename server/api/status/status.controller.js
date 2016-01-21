/**
 * ENDPOINT OVERVIEW
 * 
 * 
 * GET     index  -> /                          returns an array of status names 
 *                                              Table: dbo.Project_Status_LU
 *                                              Output:  Status_ID, Status, Status_Description
 * GET     show   -> /:id                       returns an array of the status history for a single project 
 *                                              Table: dbo.Change_Log_PROJECT_STATUS 
 *                                              Output:  ID, Sponsor_Status, MTC_Status, Status_Change_Notes, Change_Action, Project_ID, Updated_By, Update_Date
 * POST     update ->  /:id                     Updates an existing project status
 *                                              Stored Procedure: sp_UpdateProjectStatus
 *                                              Params: Project_ID, Updated_By, Sponsor_Status, MTC_Status, Status_Change_Notes
 * POST     updateMapStatus ->  /mapstatus/:id  Updates mapping status for a specific project
 *                                              Stored Procedure: sp_UpdateMappingStatus
 *                                              Params: Project_ID, Updated_By, Mapping_Status
 */

'use strict';

var _ = require('lodash');
var sql = require('mssql');
var config = require('./../../config/environment');

// Get list of statuss
exports.index = function(req, res) {
    var request = new sql.Request(config.mssql.connection);
    request.query("select * FROM dbo.Project_Status_LU", function(err, data) {
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

// Get a single projects status history
exports.show = function(req, res) {
    var projectid = req.params.id;
    console.log(projectid);
    var request = new sql.Request(config.mssql.connection);
    request.query("select * FROM dbo.Change_Log_PROJECT_STATUS WHERE Project_ID='" + projectid + "'", function(err, data) {
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


// Updates an existing status in the DB.
exports.update = function(req, res) {
    var projectid = req.params.id;
    var status = req.body.Sponsor_Status;
    var notes = req.body.notes;
    var message;
    var messageMTC = 'Not Submitted';
    console.log(projectid);
    console.log(status);
    console.log(notes);

    console.log(req.body);


    if (status === 'Deleted') {
        message = 'Project Successfully Deleted';
    } else if (status === 'Submitted to MTC') {
        message = 'Project Successfully Updated';
        messageMTC = 'Submitted';
    } else {
        message = 'Project Successfully Updated';
    }

    var response = [{
        "response": message
    }];

    var request = new sql.Request(config.mssql.connection);
    //res.send(id);
    //var username = id.UserName;
    //console.log(UserName);
    request.input('Project_ID', sql.NVarChar(60), projectid);
    request.input('Updated_By', sql.NVarChar(60), req.user.name);
    request.input('Sponsor_Status', sql.NVarChar(255), status);
    request.input('MTC_Status', sql.NVarChar(255), messageMTC);
    request.input('Status_Change_Notes', sql.NVarChar(1000), notes);

    console.log('about to run...');
    request.execute('[dbo].[sp_UpdateProjectStatus]', function(err, recordsets, returnValue) {
        console.log('runnnnng');
        //console.log(err);
        console.log(returnValue);
        if (err) {
            return next(err, null);
        }
        if (returnValue === 0) {
            res.json(response);
        }


    });
};

// Updates an existing map status in the DB.
exports.updateMapStatus = function(req, res) {
    var projectid = req.params.id;
    var status = req.body.Mapping_Status;

   // console.log(req.body);
    console.log(status);

    var request = new sql.Request(config.mssql.connection);
    //res.send(id);
    //var username = id.UserName;
    //console.log(UserName);
    request.input('Project_ID', sql.NVarChar(60), projectid);
    request.input('Updated_By', sql.NVarChar(60), req.user.name);
    request.input('Mapping_Status', sql.NVarChar(255), status);

    console.log('about to run...');
    request.execute('[dbo].[sp_UpdateMappingStatus]', function(err, recordsets, returnValue) {
        console.log('runnnnng');
        //console.log(err);
        console.log(returnValue);
        if (err) {
            return next(err, null);
        }
        if (returnValue === 0) {
            res.json({
                'response': 'success'
            });
        }


    });
};


function handleError(res, err) {
    return res.status(500).send(err);
}
