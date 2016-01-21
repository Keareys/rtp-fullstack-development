/**
 * ENDPOINT OVERVIEW
 * 
 * GET     /index         -> /                        returns a list of projects based on user role. 
 *                                                    Fields:Project_ID, Project_Title, Project_Description, Sponsor_Status, County, Sponsor_Agency, Total_Cost_2017, Performance_Status, Total_Messages, Status_Count, Mapping_Status, Tool_Type
 * GET     /showDetail    -> /detail/:id              returns a single project based on Project_ID. Used in project view mode. 
 *                                                    Table: dbo.PROJECT_MAIN_VW_Unchanged
 *                                                    Fields: Returns all project fields.
 * GET     /showMapDetail ->  /mapdetail/:id          returns a single project based on Project_ID. Used in project map view. 
 *                                                    Table: dbo.PROJECT_MAIN_VW_Unchanged
 *                                                    Fields:  Project_ID, Update_Date, Updated_By, Project_Title, Project_Description, MAP_ID, Created_By, Feature_Type, Mapping_Status, RTP_ID, 
 *                                                    Project_Notes, Modeling_Details, Mapping_Description, Modeling_Contact, First_Name, Last_Name, Email, Performance_Status, MTC_Status, WKT_WGS84, InPDA, InCOC, InHOA, InTPA, Tool_Type
 * GET     /update        ->  /:id                    Updates a project's information. 
 *                                                    Stored Procedure: sp_UpdateProject @params = Project_ID etc
 * GET     /destroy       ->  /:id                    Deletes a project by setting Sponsor_Status to 'Deleted'
 *                                                    Stored procedure: sp_DeleteProject @params Project_ID, Sponsor_Status, MTC_Status
 * POST     /updateMapFeature -> /feature/:id'        Updates an existing project map data with WKT feature
 *                                                    Stored procedure: sp_UpdateMapFeature @params Mapping_Status, WKT_WGS84, Updated_By
 * POST     /addMapFeature   -> /addfeature/:id'      Adds WKT feature to existing project. Updates Mapping_Data table
 *                                                     Stored procedure: sp_addMapFeature @params Mapping_Status, WKT_WGS84, Updated_By
 * POST     /updateToolType  -> /tooltype/:id          Updates the tool type associated with a project
 *                                                     Stored procedure: sp_UpdateToolType @params Project_ID, Tool_Type, Updated_By
 * GET     /modelingFiles   ->  /modelingfiles/:id     returns modeling files associated with a project based on Project_ID
 *                                                     Table: dbo.Modeling_Attachments
 *                                                     Fields:  ID, Modeling_File_ID, Project_ID, Update_Date, Updated_By, Modeling_File_Path, Original_File_Name, Uploaded_File_Name
 * GET     /emails          ->  /emails/:id'          returns contacts related to a project based on Project_ID
 *                                                    Table: dbo.Project_Update_Emails_Vw
 *                                                    Fields: Project_ID, county, sponsor_status, Created_By, PM_Email, CMA_Email
 * GET     /projectList     ->  /projectList/:id'      returns projects contained in a specific list based on List_ID
 *                                                     Table: dbo.ProjectList_Grid_VW
 *                                                     Fields:  Project_ID, Update_Date, Updated_By, Project_Title, Project_Description, MAP_ID, Mapping_Description, MTC_Status, Status_Change_Notes,
 *                                                     Sponsor_Agency, Created_By, Operating_Agency, Implementing_Agency, County, Branch_Number, Total_Discretionary_Funding, Status_Count, Total_Messages, 
 *                                                     Total_Unread_Messages, Mapping_Status, RTP_ID, Sponsor_Status, Modeling_Details, Tool_Type, List_ID 
 * GET     /listNames       ->  /listNames            returns array of list names 
 *                                                    Table: dbo.List
 *                                                     Fields: ID, List_ID, List_Name, List_Description, List_Owner
 * POST     /insertList      ->  /insertList           creates a new list
 *                                                     Stored procedure: sp_InsertNewList @params: List_ID, List_Name, List_Description, List_Owner
 * POST     /insertIntoList  ->  /insertIntoList       inserts a project into a specific list
 *                                                     Stored procedure: sp_InsertProjectList @params: List_ID, Project_ID
 * POST     /removeFromList  ->  /removeFromList/:id'  removes a project from a specific list
 *                                                     Stored procedure: sp_DeleteProjectList @params: List_ID, Project_ID
 * POST     updateProjectContacts      ->  /updateProjectContacts/:id           updates project contacts
 *                                                                              Stored procedure: sp_UpdateProjectContacts 
 *                                                                              @params: List_ID, List_Name, List_Description, List_Owner
 * POST     updateProjectCostSchedule  ->  /updateProjectCostSchedule/:id       updates project cost and schedule
 *                                                                              Stored procedure: sp_UpdateProjectCostSched 
 *                                                                              @params: List_ID, Project_ID
 * POST     updateProjectDetailCost  ->  /updateProjectDetailCost/:id'          updates project detailed cost
 *                                                                              Stored procedure: sp_UpdateProjectDetailCost 
 *                                                                              @params: List_ID, Project_ID
 * POST     updateProjectFunding      ->  /updateProjectFunding/:id             updates project funding
 *                                                                              Stored procedure: sp_UpdateProjectFunding 
 *                                                                              @params: List_ID, List_Name, List_Description, List_Owner
 * POST     updateProjectGeneral  ->  /updateProjectGeneral/:id                 updates general project information
 *                                                                              Stored procedure: sp_UpdateProjectGeneral 
 *                                                                              @params: List_ID, Project_ID
 * POST     updateProjectModeling  ->  /updateProjectModeling/:id'              updates project modeling information
 *                                                                              Stored procedure: sp_UpdateProjectModeling 
 *                                                                              @params: List_ID, Project_ID
 * 
 * GET     /committedFunding -> /committedFunding/:id  returns array of committed funding sources for a project
 *                                                     Table: dbo.Committed_Funding
 *                                                     Fields:  ID, Project_ID, Funding_ID, Commit_Fund_Amt, Commit_Fund_Source, Update_Date, Updated_By
 */

'use strict';
var _ = require('lodash');
var Projects = require('./projects.model');
var sql = require('mssql');
var config = require('./../../config/environment');
var uuid = require('node-uuid');



// Get list of projects
exports.index = function(req, res) {
    console.log(req.param('status'));
    console.log(req.user);
    //Get agency URL parameter
    var username = req.user.name;
    var agency = req.user.agency;
    var role = req.user.role;
    var county = req.user.county;
    var status = req.param('status');
    var projectidParam = req.param('projectid');
    var statusParam;
    var queryString;

    if (status === 'cma') {
        statusParam = "Sponsor_Status not in ('Deleted') AND Sponsor_Status = 'Submitted to CMA'";
    } else if (status === 'mtc') {
        statusParam = "Sponsor_Status not in ('Deleted') AND Sponsor_Status = 'Submitted to MTC'";
    } else if (status === 'priority') {
        statusParam = "Sponsor_Status not in ('Deleted') AND Sponsor_Status in ('Imported', 'Imported CMA', 'Needs Information','Needs Information CMA')";
    } else if (status === 'performance') {
        statusParam = "Sponsor_Status not in ('Deleted') AND Performance_Status = 'Needs Evaluation'";
    } else if (status === 'unmapped') {
        statusParam = "Sponsor_Status not in ('Deleted') AND Mapping_Status = 'Not Yet Mapped'";
    } else if (projectidParam) {
        statusParam = "Project_ID = '" + projectidParam + "'";
    } else {
        statusParam = "Sponsor_Status not in ('Deleted')";
    }
    console.log(statusParam);
    //If user is from MTC, load all projects. Otherwise filter projects based on agency

    if (role === "MTC Administrator") {

        queryString = "SELECT Project_ID, Project_Title, Project_Description, Sponsor_Status, County, Sponsor_Agency, Total_Cost_2017, Performance_Status, Total_Messages, Status_Count, Mapping_Status, Tool_Type FROM dbo.PROJECT_MAIN_VW_Unchanged WHERE (" + statusParam + ") order by Update_Date DESC";


    } else if (role === "CMA Administrator") {
        queryString = "SELECT Project_ID, Project_Title, Project_Description, Sponsor_Status, County, Sponsor_Agency, Total_Cost_2017, Performance_Status, Total_Messages, Status_Count, Mapping_Status, Tool_Type FROM dbo.PROJECT_MAIN_VW_Unchanged WHERE (" + statusParam + ") AND (County in ('" + county + "') or Sponsor_Agency = '" + agency + "') order by Update_Date DESC";
        console.log(role);
        console.log(queryString);
    } else if (role === "Multi-County Sponsor") {
        queryString = "SELECT Project_ID, Project_Title, Project_Description, Sponsor_Status, County, Sponsor_Agency, Total_Cost_2017, Performance_Status, Total_Messages, Status_Count, Mapping_Status, Tool_Type FROM dbo.PROJECT_MAIN_VW_Unchanged WHERE Sponsor_Agency = '" + agency + "' or County = 'Regional' order by Update_Date DESC";
    } else {
        queryString = "SELECT Project_ID, Project_Title, Project_Description, Sponsor_Status, County, Sponsor_Agency, Total_Cost_2017, Performance_Status, Total_Messages, Status_Count, Mapping_Status, Tool_Type FROM dbo.PROJECT_MAIN_VW_Unchanged WHERE (" + statusParam + ") AND Sponsor_Agency = '" + agency + "' order by Update_Date DESC";

    }

    console.log(username);
    console.log(agency);


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


// Get a single projects full detail
exports.showDetail = function(req, res) {
    var id = req.params.id;
    var request = new sql.Request(config.mssql.connection);
    var query = "Select * FROM dbo.PROJECT_MAIN_VW_Unchanged WHERE Project_ID ='" + id + "'";
    request.query(query, function(err, projects) {
        if (err) {
            return handleError(res, err);
        }
        if (!projects) {
            return res.status(404).send('Not Found');
        }
        res.json(projects);
    });


};

// Get a single projects map details
exports.showMapDetail = function(req, res) {
    var id = req.params.id;
    var request = new sql.Request(config.mssql.connection);
    var query = "Select * FROM dbo.PROJECT_MAPVIEW_VW WHERE Project_ID ='" + id + "'";
    request.query(query, function(err, projects) {
        if (err) {
            return handleError(res, err);
        }
        if (!projects) {
            return res.status(404).send('Not Found');
        }
        res.json(projects);
    });


};



// Updates an existing projects in the DB.
exports.updateProjectContacts = function(req, res) {

    var request = new sql.Request(config.mssql.connection);
    var id = req.params.id;
    var body = req.body;

    //Stored procedure parameters
    request.input('Project_ID', sql.NVarChar(255), id);
    request.input('Updated_By', sql.NVarChar(255), req.user.name);
    request.input('PM_Contact_CODE', sql.NVarChar(255), body[0].PM_Contact_CODE);
    request.input('Modeling_Contact', sql.NVarChar(255), body[0].Modeling_Contact);

    request.execute('[dbo].[sp_UpdateProjectContacts]', function(err, recordsets, returnValue) {
        if (err) {
            return handleError(res, err);
        }
        console.log('executing');
        console.log(returnValue + " Procedure Code");
        if (err) {
            return next(err, null);
        } else if (returnValue === 0) {
            console.log("Should be updated");
            var response = {
                "status": "success"
            };
            console.log(response);
            res.json(response);
        } else {
            return res.status(404).send('Not Found');
        }

    });


};

// Updates an existing projects in the DB.
exports.updateProjectCostSchedule = function(req, res) {

    var request = new sql.Request(config.mssql.connection);
    var id = req.params.id;
    var body = req.body;
    console.log(body[0].Certified_Env_Doc_Date);

    //Stored procedure parameters
    request.input('Project_ID', sql.NVarChar(255), id);
    request.input('Updated_By', sql.NVarChar(255), req.user.name);
    request.input('Certified_Env_Doc_Date', sql.NVarChar(255), body[0].Certified_Env_Doc_Date);
    request.input('Cost_Capital', sql.NVarChar(255), body[0].Cost_Capital);
    request.input('Cost_OM', sql.NVarChar(255), body[0].Cost_OM);
    request.input('Total_Cost_2017', sql.NVarChar(255), body[0].Total_Cost_2017);
    request.input('Construction_Start_Year', sql.NVarChar(255), body[0].Construction_Start_Year);
    request.input('OM_Start_Year', sql.NVarChar(255), body[0].OM_Start_Year);
    request.input('User_Benefit_Share_Auto', sql.NVarChar(255), body[0].User_Benefit_Share_Auto);
    request.input('User_Benefit_Share_Transit', sql.NVarChar(255), body[0].User_Benefit_Share_Transit);
    request.input('User_Benefit_Share_Bike', sql.NVarChar(255), body[0].User_Benefit_Share_Bike);
    request.input('User_Benefit_Share_Pedestrian', sql.NVarChar(255), body[0].User_Benefit_Share_Pedestrian);
    request.input('User_Benefit_Share_Freight', sql.NVarChar(255), body[0].User_Benefit_Share_Freight);

    request.execute('[dbo].[sp_UpdateProjectCostSched]', function(err, recordsets, returnValue) {
        if (err) {
            return handleError(res, err);
        }
        console.log('executing');
        console.log(returnValue + " Procedure Code");
        if (err) {
            return next(err, null);
        } else if (returnValue === 0) {
            console.log("Should be updated");
            var response = {
                "status": "success"
            };
            console.log(response);
            res.json(response);
        } else {
            return res.status(404).send('Not Found');
        }

    });
};

// Updates an existing projects in the DB.
exports.updateProjectDetailCost = function(req, res) {

    var request = new sql.Request(config.mssql.connection);
    var id = req.params.id;
    var body = req.body;
    console.log(id);
    console.log(req.body);

    //Stored procedure parameters
    request.input('Project_ID', sql.NVarChar(255), id);
    request.input('Updated_By', sql.NVarChar(255), req.user.name);
    request.input('Cost_Env', sql.NVarChar(255), body[0].Cost_Env);
    request.input('Cost_ROW', sql.NVarChar(255), body[0].Cost_ROW);
    request.input('Cost_Construction', sql.NVarChar(255), body[0].Cost_Construction);
    request.input('Cost_RollingStock', sql.NVarChar(255), body[0].Cost_RollingStock);
    request.input('Cost_Operations', sql.NVarChar(255), body[0].Cost_Operations);
    request.input('Cost_Maintenance', sql.NVarChar(255), body[0].Cost_Maintenance);
    request.input('Env_Start_Year', sql.NVarChar(255), body[0].Env_Start_Year);
    request.input('Env_End_Year', sql.NVarChar(255), body[0].Env_End_Year);
    request.input('ROW_Start_Year', sql.NVarChar(255), body[0].ROW_Start_Year);
    request.input('ROW_End_Year', sql.NVarChar(255), body[0].ROW_End_Year);
    request.input('Construction_Start_Year_DET', sql.NVarChar(255), body[0].Construction_Start_Year_DET);
    request.input('Construction_End_Year_DET', sql.NVarChar(255), body[0].Construction_End_Year_DET);
    request.input('RollStock_Start_Year', sql.NVarChar(255), body[0].RollStock_Start_Year);
    request.input('RollStock_End_Year', sql.NVarChar(255), body[0].RollStock_End_Year);
    request.input('Ops_Start_Year', sql.NVarChar(255), body[0].Ops_Start_Year);
    request.input('Ops_End_Year', sql.NVarChar(255), body[0].Ops_End_Year);
    request.input('Maint_Start_Year', sql.NVarChar(255), body[0].Maint_Start_Year);
    request.input('Maint_End_Year', sql.NVarChar(255), body[0].Maint_End_Year);
    request.input('Total_Cost_2017', sql.NVarChar(255), body[0].Total_Cost_2017);

    request.execute('[dbo].[sp_UpdateProjectDetailCost]', function(err, recordsets, returnValue) {
        if (err) {
            return handleError(res, err);
        }
        console.log('executing');
        console.log(returnValue + " Procedure Code");
        if (err) {
            return next(err, null);
        } else if (returnValue === 0) {
            console.log("Should be updated");
            var response = {
                "status": "success"
            };
            console.log(response);
            res.json(response);
        } else {
            return res.status(404).send('Not Found');
        }


    });


};

// Updates an existing projects in the DB.
exports.updateProjectFunding = function(req, res) {

    var request = new sql.Request(config.mssql.connection);
    var id = req.params.id;
    var body = req.body;

    //Stored procedure parameters
    request.input('Project_ID', sql.NVarChar(255), id);
    request.input('Updated_By', sql.NVarChar(255), req.user.name);
    request.input('Discretionary_Funds_Regional', sql.NVarChar(255), body[0].Discretionary_Funds_Regional);
    request.input('Discretionary_Funds_OneBayArea', sql.NVarChar(255), body[0].Discretionary_Funds_OneBayArea);
    request.input('Discretionary_Funds_RTIP', sql.NVarChar(255), body[0].Discretionary_Funds_RTIP);
    request.input('Discretionary_Funds_AnticipatedLocal', sql.NVarChar(255), body[0].Discretionary_Funds_AnticipatedLocal);
    request.input('Total_Cost_YOE', sql.NVarChar(255), body[0].Total_Cost_YOE);
    request.input('Prior_2017_Funding', sql.NVarChar(255), body[0].Prior_2017_Funding);
    request.input('Total_Committed_Funding', sql.NVarChar(255), body[0].Total_Committed_Funding);

    request.execute('[dbo].[sp_UpdateProjectFunding]', function(err, recordsets, returnValue) {
        if (err) {
            return handleError(res, err);
        }
        console.log('executing');
        console.log(returnValue + " Procedure Code");
        if (err) {
            return next(err, null);
        } else if (returnValue === 0) {
            console.log("Should be updated");
            var response = {
                "status": "success"
            };
            console.log(response);
            res.json(response);
        } else {
            return res.status(404).send('Not Found');
        }

    });


};

// Updates an existing projects in the DB.
exports.updateProjectGeneral = function(req, res) {

    var request = new sql.Request(config.mssql.connection);
    var id = req.params.id;
    var body = req.body;

    console.log(id);
    //console.log(req.body);
    console.log(body[0].Project_Title);

    //Stored procedure parameters
    request.input('Project_ID', sql.NVarChar(255), id);
    request.input('Updated_By', sql.NVarChar(255), req.user.name);
    request.input('Project_Title', sql.NVarChar(255), body[0].Project_Title);
    request.input('Project_Description', sql.NVarChar(sql.MAX), body[0].Project_Description);
    request.input('Sponsor_Agency', sql.NVarChar(255), body[0].Sponsor_Agency);
    request.input('Operating_Agency', sql.NVarChar(255), body[0].Operating_Agency);
    request.input('Implementing_Agency', sql.NVarChar(255), body[0].Implementing_Agency);
    request.input('County', sql.NVarChar(255), body[0].County);

    request.execute('[dbo].[sp_UpdateProjectGeneral]', function(err, recordsets, returnValue) {
        if (err) {
            return handleError(res, err);
        }
        console.log('executing');
        console.log(returnValue + " Procedure Code");
        if (err) {
            return next(err, null);
        } else if (returnValue === 0) {
            console.log("Should be updated");
            var response = {
                "status": "success"
            };
            console.log(response);
            res.json(response);
        } else {
            return res.status(404).send('Not Found');
        }

    });


};

// Updates an existing projects in the DB.
exports.updateProjectModeling = function(req, res) {

    var request = new sql.Request(config.mssql.connection);
    var id = req.params.id;
    var body = req.body;

    //Stored procedure parameters
    request.input('Project_ID', sql.NVarChar(255), id);
    request.input('Updated_By', sql.NVarChar(255), req.user.name);
    request.input('Modeling_Details', sql.NVarChar(sql.MAX), body[0].Modeling_Details);

    request.execute('[dbo].[sp_UpdateProjectModeling]', function(err, recordsets, returnValue) {
        if (err) {
            return handleError(res, err);
        }
        console.log('executing');
        console.log(returnValue + " Procedure Code");
        if (err) {
            return next(err, null);
        } else if (returnValue === 0) {
            console.log("Should be updated");
            var response = {
                "status": "success"
            };
            console.log(response);
            res.json(response);
        } else {
            return res.status(404).send('Not Found');
        }


    });


};

// Deletes a projects from the DB.
exports.destroy = function(req, res) {

    var request = new sql.Request(config.mssql.connection);
    var id = req.params.id;

    //Stored procedure parameters
    sql.input('Project_ID', mssql.NVarChar(255), id);
    sql.input('Sponsor_Status', mssql.NVarChar(255), sponsorStatus);
    sql.input('MTC_Status', mssql.NVarChar(255), 'Not Submitted');

    sql.execute('[dbo].[sp_DeleteProject]', function(err, recordsets, returnValue) {
        if (err) {
            return handleError(res, err);
        }
        console.log('executing');
        console.log(returnValue + " Procedure Code");
        if (err)
            return next(err, null);
        if (!returnValue)
            return res.status(404).send('Not Found');
        if (returnValue === 0)
            console.log("Should be updated");

        var response = {
            "status": "success"
        };
        return res.status(200).json(response);


    });

};



// Updates an existing project map data with WKT feature
exports.updateMapFeature = function(req, res) {

    var request = new sql.Request(config.mssql.connection);
    var id = req.params.id;
    var shape;

    if (req.body.WKT_WGS84) {
        shape = req.body.WKT_WGS84;
    } else {
        shape = '';
    }

    console.log(req.body);

    //Stored procedure parameters
    request.input('Project_ID', sql.NVarChar(255), id);
    request.input('Mapping_Status', sql.NVarChar(255), 'Needs Confirmation');
    request.input('WKT_WGS84', sql.VarChar(sql.MAX), shape);
    request.input('Updated_By', sql.NVarChar(255), req.user.name);

    request.execute('[dbo].[sp_UpdateMapFeature]', function(err, recordsets, returnValue) {
        if (err) {
            return handleError(res, err);
        }
        console.log('executing');
        console.log(returnValue);

        if (returnValue === 0) {
            console.log("Should be updated");
            var response = {
                "status": "success"
            };
            return res.status(200).json(response);

        } else {
            return res.status(404).send('Not Found');
        }

    });

    request.execute('[dbo].[sp_UpdateMappingData]', function(err, recordsets, returnValue) {
        if (err) {
            return handleError(res, err);
        }
        console.log('executing');
        console.log(returnValue);

        if (returnValue === 0) {
            console.log("Should be updated");
            var response = {
                "status": "success"
            };
            return res.status(200).json(response);

        } else {
            return res.status(404).send('Not Found');
        }

    });


};
// Adds a new feature to the Mapping_Data Table.
exports.addMapFeature = function(req, res) {

    var request = new sql.Request(config.mssql.connection);
    var id = req.params.id;
    var shape;

    if (req.body.WKT_WGS84) {
        shape = req.body.WKT_WGS84;
    } else {
        shape = '';
    }

    console.log(req.body);

    //Stored procedure parameters
    request.input('Project_ID', sql.NVarChar(255), id);
    request.input('Mapping_Status', sql.NVarChar(255), 'Needs Confirmation');
    request.input('WKT_WGS84', sql.VarChar(sql.MAX), shape);
    request.input('Updated_By', sql.NVarChar(255), req.user.name);


    request.execute('[dbo].[sp_addMapFeature]', function(err, recordsets, returnValue) {
        if (err) {
            return handleError(res, err);
        }
        console.log('executing');
        console.log(returnValue);

        if (returnValue === 0) {
            console.log("Should be updated");
            var response = {
                "status": "success"
            };
            return res.status(200).json(response);

        } else {
            return res.status(404).send('Not Found');
        }

    });



};
// Updates the tool type used for a project.
exports.updateToolType = function(req, res) {

    var request = new sql.Request(config.mssql.connection);
    var id = req.params.id;
    var tooltype = req.body.Tool_Type;



    console.log(req.body);

    //Stored procedure parameters
    request.input('Project_ID', sql.NVarChar(255), id);
    request.input('Tool_Type', sql.NVarChar(255), tooltype);
    request.input('Updated_By', sql.NVarChar(255), req.user.name);

    request.execute('[dbo].[sp_UpdateToolType]', function(err, recordsets, returnValue) {
        if (err) {
            return handleError(res, err);
        }
        console.log('executing');
        console.log(returnValue);

        if (returnValue === 0) {
            console.log("Should be updated");
            var response = {
                "status": "success"
            };
            return res.status(200).json(response);

        } else {
            return res.status(404).send('Not Found');
        }

    });


};

// Get a single projects
exports.modelingFiles = function(req, res) {
    var id = req.params.id;
    var request = new sql.Request(config.mssql.connection);
    var query = "Select * FROM dbo.Modeling_Attachments WHERE Project_ID ='" + id + "'";
    request.query(query, function(err, projects) {
        if (err) {
            return handleError(res, err);
        }
        if (!projects) {
            return res.status(404).send('Not Found');
        }
        res.json(projects);
    });
}

// Get a project contacts
exports.emails = function(req, res) {
    var id = req.params.id;
    var request = new sql.Request(config.mssql.connection);

    var query = "SELECT * FROM dbo.Project_Update_Emails_Vw WHERE Project_ID ='" + id + "'";
    request.query(query, function(err, projects) {
        if (err) {
            return handleError(res, err);
        }
        if (!projects) {
            return res.status(404).send('Not Found');
        }
        res.json(projects);
    });


};

// Get list of projectss
exports.projectList = function(req, res) {
    var id = req.params.id;
    console.log(id);
    var role = req.user.role;
    var queryString;


    if (role === "MTC Administrator" || 'CMA Administrator') {
        queryString = "SELECT * FROM dbo.ProjectList_Grid_VW WHERE List_ID ='" + id + "'";
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

// Get list of list names
exports.listNames = function(req, res) {
    var queryString;
    queryString = 'SELECT *  FROM dbo.List';

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

// Creates a new list
exports.insertList = function(req, res) {

    var request = new sql.Request(config.mssql.connection);
    var id = req.body;
    var listId = uuid.v1();

    console.log(req.body);

    //Stored procedure parameters
    request.input('List_ID', sql.NVarChar(255), listId);
    request.input('List_Name', sql.NVarChar(255), id.name);
    request.input('List_Description', sql.NVarChar(255), id.description);
    request.input('List_Owner', sql.NVarChar(255), req.user.name);

    request.execute('[dbo].[sp_InsertNewList]', function(err, recordsets, returnValue) {
        if (err) {
            return handleError(res, err);
        }
        console.log('executing');
        console.log(returnValue);

        if (returnValue === 0) {
            console.log("Should be updated");
            var response = {
                "status": "success"
            };
            return res.status(200).json(response);

        } else {
            return res.status(404).send('Not Found');
        }

    });


};

// Updates an existing projects in the DB.
exports.removeList = function(req, res) {

    var request = new sql.Request(config.mssql.connection);
    var id = req.params.id;
    //Stored procedure parameters
    request.input('List_ID', sql.NVarChar(255), id);

    request.execute('[dbo].[sp_DeleteList]', function(err, recordsets, returnValue) {
        if (err) {
            return handleError(res, err);
        }
        console.log('executing');
        console.log(returnValue);

        if (returnValue === 0) {
            console.log("Should be updated");
            var response = {
                "status": "success"
            };
            return res.status(200).json(response);

        } else {
            return res.status(404).send('Not Found');
        }

    });


};

// Insert a project into a specific list.
exports.insertIntoList = function(req, res) {

    var request = new sql.Request(config.mssql.connection);
    var id = req.body;
    console.log(req.body);
    var queryString = "Select * FROM dbo.Project_List_Bridge where Project_ID = '" + id.Project_ID + "' AND List_ID = '" + id.List_ID + "'";
    var response = [];

    //Stored procedure parameters
    request.input('List_ID', sql.NVarChar(255), id.List_ID);
    request.input('Project_ID', sql.NVarChar(255), id.Project_ID);

    //Query list table to see if project already exists. If not, insert project into list
    request.query(queryString, function(err, data) {
        console.log(data.length);
        if (err) {
            handleError(res, err);
            return;
        } else if (data.length > 0) {
            var response = {
                response: 'Exists'
            };
            return res.status(200).json(response);

        } else if (data.length === 0) {
            request.execute('[dbo].[sp_InsertProjectList]', function(err, recordsets, returnValue) {
                if (err) {
                    return handleError(res, err);
                }
                console.log('executing');
                console.log(returnValue);

                if (returnValue === 0) {
                    console.log("Should be updated");
                    var response = {
                        "status": "success"
                    };
                    return res.status(200).json(response);

                } else {
                    return res.status(404).send('Not Found');
                }

            });

        }

    });




};

// Updates an existing projects in the DB.
exports.removeFromList = function(req, res) {

    var request = new sql.Request(config.mssql.connection);
    var id = req.params.id;

    //Stored procedure parameters
    request.input('Project_ID', sql.NVarChar(255), id);
    request.input('List_ID', sql.NVarChar(255), req.body.listId);

    request.execute('[dbo].[sp_DeleteProjectList]', function(err, recordsets, returnValue) {
        if (err) {
            return handleError(res, err);
        }
        console.log('executing');
        console.log(returnValue);

        if (returnValue === 0) {
            console.log("Should be updated");
            var response = {
                "status": "success"
            };
            return res.status(200).json(response);

        } else {
            return res.status(404).send('Not Found');
        }

    });


};

//Committed funding
//
// Get committed funding sources for a project
exports.committedFunding = function(req, res) {
    var id = req.params.id;
    console.log(id);
    var role = req.user.role;
    var queryString;
    queryString = "SELECT * FROM dbo.Committed_Funding WHERE Project_ID ='" + id + "'";
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
