/**
 * ENDPOINT OVERVIEW
 * 
 * 
 * GET     index  -> /                                          returns an array of bundled performance project names. 
 *                                                              Table: dbo.Performance_Bundle
 *                                                              Output: ID, Bundle_ID, Bundle_Name, Bundle_Owner
 * GET     bundledProjects   -> /bundledProjects/:id             returns an array of projects participating in specific bundle
 *                                                               Table: dbo.Bundle_Project_VW 
 *                                                               Output: Bundle_ID, Bundle_Name, Project_ID, Project_Title, Project_Description, Mapping_Status, Sponsor_Agency
 * POST     bundledProjectFeatures ->  /bundledProjectFeatures  returns an array of project map information based on bundle ID
 *                                                              Table: dbo.Bundle_Project_Map_VW
 *                                                              Output: Bundle_ID, Project_ID, Mapping_Status, WKT_WGS84
 * POST     showBundledProjects ->  /showBundleProjects         Returns array of projects participating in a bundle with full project details 
 *                                                              Table: dbo.PROJECT_MAIN_VW_Unchanged
 *                                                              Output: All project fields
 */

'use strict';

var _ = require('lodash');
var sql = require('mssql');
var config = require('./../../config/environment');



// Get list of projectss
exports.index = function(req, res) {

    //var role = req.user.role;
    var queryString;
    // if (role === "MTC Administrator") {
    queryString = "SELECT Perf_ID, Performance_Name FROM dbo.Performance_Bundle GROUP BY Perf_ID, Performance_Name";
    // }

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

// Get list of bundled projects
exports.bundledProjects = function(req, res) {

    var id = req.params.id;
    var queryString = "SELECT Project_ID, Project_Title FROM dbo.Bundle_Project_VW  where Bundle_ID ='" + id + "' GROUP BY Project_ID, Project_Title";

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


// Get list of bundled projects
exports.bundledProjectFeatures = function(req, res) {
    console.log(req.body);
    var idString, testString;
    var id = req.body;
    console.log(id.length);
    var startString, endString = '';
    var mainString = '';

    if (id.length === 1) {
        idString = "'" + id[0].Project_ID + "'";
    } else if (id.length === 2) {
        idString = "'" + id[0].Project_ID + "','" + id[1].Project_ID + "'";
    } else if (id.length > 2) {

        for (var i = 0; i < id.length; i++) {
            console.log(id[i].Project_ID);
            console.log(i);
            if (i === 0) {
                startString = "'" + id[0].Project_ID + "',";
            } else if (i > 0 && i < id.length - 1) {
                mainString = mainString + "'" + id[i].Project_ID + "',";
            } else if (i === id.length - 1) {
                endString = "'" + id[i].Project_ID + "'";
            }
        }
        idString = startString + mainString + endString;
        console.log(idString);

    }

    var queryString = "Select * From dbo.Bundle_Project_Map_VW where Project_ID in (" + idString + ")";

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
        //console.log(data);
        res.json(data);
    });

};


//Find the Policy Overlay Features for any project that iintersects an overlay
exports.findPerformanceCOCs = function(req, res) {
    var id = req.params.id;
    var request = new sql.Request(config.mssql.connection);
    var query = "Select Distinct Project_ID, PolicyOverlay_WKT FROM dbo.PerformanceProjects_COCs WHERE Project_ID ='" + id + "'";
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
exports.findPerformanceHOAs = function(req, res) {
    var id = req.params.id;
    var request = new sql.Request(config.mssql.connection);
    var query = "Select Distinct Project_ID, PolicyOverlay_WKT FROM dbo.PerformanceProjects_HOAs WHERE Project_ID ='" + id + "'";
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
exports.findPerformancePDAs = function(req, res) {
    var id = req.params.id;
    var request = new sql.Request(config.mssql.connection);
    var query = "Select Distinct Project_ID, PolicyOverlay_WKT FROM dbo.PerformanceProjects_PDAs WHERE Project_ID ='" + id + "'";
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
exports.findPerformanceTPAs = function(req, res) {
    var id = req.params.id;
    var request = new sql.Request(config.mssql.connection);
    var query = "Select Distinct Project_ID, PolicyOverlay_WKT FROM dbo.PerformanceProjects_TPAs WHERE Project_ID ='" + id + "'";
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


// Get list of projects participating in a bundle
exports.showBundleProjects = function(req, res) {

    console.log(req.body);
    var idString, testString;
    var id = req.body;
    console.log(id.length);
    var startString, endString = '';
    var mainString = '';

    if (id.length === 1) {
        idString = "'" + id[0].Project_ID + "'";
    } else if (id.length === 2) {
        idString = "'" + id[0].Project_ID + "','" + id[1].Project_ID + "'";
    } else if (id.length > 2) {

        for (var i = 0; i < id.length; i++) {
            console.log(id[i].Project_ID);
            console.log(i);
            if (i === 0) {
                startString = "'" + id[0].Project_ID + "',";
            } else if (i > 0 && i < id.length - 1) {
                mainString = mainString + "'" + id[i].Project_ID + "',";
            } else if (i === id.length - 1) {
                endString = "'" + id[i].Project_ID + "'";
            }
        }
        idString = startString + mainString + endString;
        console.log(idString);

    }
    var queryString = "Select * FROM dbo.PROJECT_MAIN_VW_Unchanged WHERE Project_ID in(" + idString + ")";

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

function handleError(res, err) {
    return res.status(500).send(err);
}
