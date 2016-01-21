'use strict';

var _ = require('lodash');
var Mapping = require('./mapping.model');
var sql = require('mssql');
var config = require('./../../config/environment');

exports.updateXY = function(req, res) {
    var id = req.body;
    var request = new sql.Request(config.mssql.connection);
    request.input('Lat', sql.Numeric(18, 6), id.Lat);
    request.input('Long', sql.Numeric(18, 6), id.Long);

    request.execute('[dbo].[sp_Update_Mapping_XY_Event]', function(err, recordsets, returnValue) {
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

exports.updateLRS = function(req, res) {
    var id = req.body;
    var request = new sql.Request(config.mssql.connection);
    request.input('RID', sql.NVarChar(100), id.RID);
    request.input('From_Measure', sql.Numeric(18, 6), id.From_Measure);
    request.input('To_Measure', sql.Numeric(18, 6), id.To_Measure);

    request.execute('[dbo].[sp_Update_Mapping_LRS_Input]', function(err, recordsets, returnValue) {
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
