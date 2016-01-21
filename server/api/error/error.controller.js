/**
 * ENDPOINT OVERVIEW
 * 
 * 
 * GET     /show  -> /                    returns an array of application errors. 
 *                                         Table: dbo.Error_Log
 *                                         Output:    ID, Error_ID, Webpage, Error_Message, Browser, IP_Address, SQL_Name, SQL_Message, SQL_Code, SQL_srvName, SQL_procName, 
 *                                                    SQL_precedingErrors, Date, Read_Flag
 * POST     /update   -> /:id              Updates read flag to show whether an error has been reviewed or not 
 *                                         Stored Procedure: sp_UpdateErrorFlag @params Error_ID, Read_Flag 
 */


'use strict';

var _ = require('lodash');
var sql = require('mssql');
var config = require('./../../config/environment');

// Get a single error
exports.show = function(req, res) {
    var request = new sql.Request(config.mssql.connection);
    request.query("SELECT * FROM dbo.Error_Log ORDER BY Read_Flag, Date", function(err, data) {
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


// Updates an existing error in the DB.
exports.update = function(req, res) {
    var request = new sql.Request(config.mssql.connection);
    var errorid = req.params.id;

    request.input('Error_ID', sql.NVarChar(60), errorid);
    request.input('Read_Flag', sql.NVarChar(60), "1");

    request.execute('[dbo].[sp_UpdateErrorFlag]', function(err, recordsets, returnValue) {
        console.log(recordsets);
        //console.log(err);
        console.log(returnValue);
        if (err) {
            console.log(err);
            return next(err, null);
        }
        if (returnValue === 0)
            res.json([{
                "response": "success"
            }]);
    });
};


function handleError(res, err) {
    return res.status(500).send(err);
}
