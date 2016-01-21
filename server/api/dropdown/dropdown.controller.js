/**
 * ENDPOINT OVERVIEW
 * Summaries are calculated using crossfilter library
 * 
 * GET     counties  -> /counties                returns an array of counties. 
 *                                                Table: dbo.County_Code_LU
 *                                                 Output:   ID, County_ID, County_Name
 * GET     agencies   -> /agencies                 returns an array of agency names 
 *                                                 Table: dbo.Agency_LU 
 *                                                  Output: Agency_ID, Agency_Name, County, Role
 * GET     roles ->  /roles                         returns a summary of application erros
 *
 * GET     committedFunding ->  /committedFunding   returns a summary of application erros
 */

'use strict';

var _ = require('lodash');
var sql = require('mssql');
var config = require('./../../config/environment');

// Get list of counties
exports.counties = function(req, res) {
   var request = new sql.Request(config.mssql.connection);
    var query = "Select County FROM [dbo].[Agency_LU] Group by County";
    request.query(query, function(err, data) {
        if (err) {
            return handleError(res, err);
        }
        if (!data) {
            return res.status(404).send('Not Found');
        }
        res.json(data);
    });

};


// Get list of agencies
exports.agencies = function(req, res) {
    var request = new sql.Request(config.mssql.connection);
    var query = "Select Agency_Name FROM [dbo].[Agency_LU]";
    request.query(query, function(err, data) {
        if (err) {
            return handleError(res, err);
        }
        if (!data) {
            return res.status(404).send('Not Found');
        }
        res.json(data);
    });

};


// Get list of roles
exports.roles = function(req, res) {
    var request = new sql.Request(config.mssql.connection);
    var query = "Select Role_Description FROM [dbo].[User_Roles_LU]";
    request.query(query, function(err, data) {
        if (err) {
            return handleError(res, err);
        }
        if (!data) {
            return res.status(404).send('Not Found');
        }
        res.json(data);
    });

};


// Get list of committed funding sources
exports.committedFunding = function(req, res) {
    var request = new sql.Request(config.mssql.connection);
    var query = "Select * FROM [dbo].[Committed_Funding_Source_LU]";
    request.query(query, function(err, data) {
        if (err) {
            return handleError(res, err);
        }
        if (!data) {
            return res.status(404).send('Not Found');
        }
        res.json(data);
    });

};


function handleError(res, err) {
    return res.status(500).send(err);
}
