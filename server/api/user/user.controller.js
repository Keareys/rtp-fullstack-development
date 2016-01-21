/**
 * ENDPOINT OVERVIEW
 * 
 * GET     index         -> /               returns a list of users
 *                                          Table:dbo.Membership_VW
 *                                          Output:  ID, Membership_ID, First_Name, Last_Name, Email, Active, Date_Added, Job_Title, Updated_By, Update_Date, Phone, County, User_Role, Agency, 
 *                                                   Password_Hash, Member_County, Member_Role
 * PUT     update         -> /:id           Updates specific user information
 *                                          Stored Procedure: sp_UpdateMember
 *                                          Params: Membership_ID, First_Name, Last_Name, Job_Title, Email, Phone, Agency, County, Password_Hash, User_Role, Updated_By
 * GET     me             ->  /me           Returns info for logged in user based on membership ID
 *                                          Table: dbo.AppMembership
 *                                          Output:  ID, Membership_ID, First_Name, Last_Name, Email, Active, Date_Added, Job_Title, Updated_By, Update_Date, Phone, County, User_Role, Agency, 
 *                                                   Password_Hash, Member_County, Member_Role
 * GET     show           ->  /:id          Returns a single user based on membership id
 *                                          Table: dbo.Membership_VW
 *                                          Output: ID, Membership_ID, First_Name, Last_Name, Email, Active, Date_Added, Job_Title, Updated_By, Update_Date, Phone, County, User_Role, Agency, 
 *                                                   Pa                                                                                        ssword_Hash, Member_County, Member_Role
 * POST     create        -> /              Adds a new user to the database on registration
 *                                          Stored procedure: sp_InsertNewMember
 *                                          @params Membership_ID, First_Name, Last_Name, Job_Title, Email, Phone, Agency, County, Password_Hash, User_Role, Updated_By
 * POST     myAccount     -> /myaccount     Updates logged in user's account information
 *                                          Stored procedure: sp_UpdateUser 
 *                                          @params Membership_ID, First_Name, Last_Name, Job_Title, Email, Phone, Updated_By
 * POST     myPwd         -> /mypwd         Allows logged in user to reset password
 *                                          Stored procedure: sp_UpdatePassword 
 *                                          @params Membership_ID, Updated_By, Password_Hash
 * POST     pwd            ->  /pwd/:id     Allows admins to update any user's password
 *                                          Stored Procedure: sp_UpdatePassword
 *                                          Params:  Membership_ID, Updated_By, Password_Hash
 * POST     destroy        ->  /remove/:id  Deletes a user
 *                                          Stored Procedure: sp_DeleteMember
 *                                          Params: Membership_ID
 */

'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var uuid = require('node-uuid');
var sql = require('mssql');

var validationError = function(res, err) {
    return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
    var agency = req.user.agency;
    var county = req.user.county;
    var queryString;
    var role = req.user.role;
    var status = req.param('status');
    var statusParam;

    console.log(status);
    if (status === 'inactive') {
        statusParam = '(0)';
    } else {
        statusParam = '(0,1)';
    }

    if (role === "MTC Administrator") {
        queryString = "SELECT Membership_ID, First_Name, Last_Name, Email, Phone, Job_Title,User_Role, Agency, Active FROM dbo.Membership_VW where Active in " + statusParam + " order by First_Name ";
    } else if (role === 'CMA Administrator') {
        queryString = "SELECT Membership_ID, First_Name, Last_Name, Email, Phone, Job_Title,User_Role, Agency, Active FROM dbo.Membership_VW WHERE Member_County = '" + county + "' AND Active in " + statusParam + " order by First_Name";
    } else {
        queryString = "SELECT Membership_ID, First_Name, Last_Name, Email, Phone, Job_Title,User_Role, Agency, Active FROM dbo.Membership_VW WHERE Agency = '" + agency + "' AND Active in " + statusParam + " order by First_Name";
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

/**
 * Creates a new user
 */

exports.create = function(req, res) {
    var membershipid = uuid.v1();
    console.log(req.body);
    var id = req.body;
    var password = req.body.Password;
    var request = new sql.Request(config.mssql.connection);
    //Look up agency and determine what default role and county should be
    request.query("SELECT * FROM dbo.Agency_LU Where Agency_Name = '" + req.body.Agency + "'", function(err, agencyLU) {
        console.log(agencyLU);
        if (err) {
            console.log(err);
        } else {

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    console.log(hash);
                    request.input('Membership_ID', sql.NVarChar(60), membershipid);
                    request.input('First_Name', sql.NVarChar(255), id.First_Name);
                    request.input('Last_Name', sql.NVarChar(255), id.Last_Name);
                    request.input('Job_Title', sql.NVarChar(255), id.Job_Title);
                    request.input('Email', sql.NVarChar(100), id.Email);
                    request.input('Phone', sql.NVarChar(100), id.Phone);
                    request.input('Agency', sql.NVarChar(255), id.Agency);
                    request.input('County', sql.NVarChar(255), agencyLU[0].County);
                    request.input('Password_Hash', sql.NVarChar(60), hash);
                    request.input('User_Role', sql.NVarChar(255), agencyLU[0].Role);
                    request.input('Updated_By', sql.NVarChar(255), "New Registration");
                    console.log('abou tto run');

                    request.execute('dbo.sp_InsertNewMember', function(err, recordsets, returnValue) {
                        if (err) {
                            return done(err, null);
                        }
                        if (returnValue === 0) {
                            console.log('should be inserted');
                            var token = jwt.sign({
                                membershipid: membershipid
                            }, config.secrets.session, {
                                expiresInMinutes: 60 * 5
                            });
                            res.json({
                                token: token
                            });
                        }
                    });
                });
            });
        }
    });


};


/**
 * Get a single user
 */
exports.show = function(req, res, next) {
    var id = req.params.id;
    var queryString = "SELECT * FROM dbo.Membership_VW where Membership_ID ='" + id + "'";

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

/**
 * Updates a user
 * restriction: 'admin'
 */
exports.update = function(req, res) {
    var id = req.body;
    console.log(req.user.name);
    console.log(id);


    // var id = JSON.parse(req.body.models);
    // console.log(id);

    var activeStatus;
    var contactid;

    contactid = id.Membership_ID;
    console.log(contactid);

    var request = new sql.Request(config.mssql.connection);

    request.query("SELECT * FROM [dbo].[Agency_LU] WHERE [Agency_Name] = '" + id.Agency + "'", function(err, info) {
        if (err) {
            console.log(err);
        } else {

            console.log('the agency lookup');
            console.log(info);
            var county = info[0].County;
            console.log(county);

            //Query database to get user info
            request.query("SELECT * FROM [dbo].[Membership_VW] WHERE Membership_ID = '" + contactid + "'", function(err, data) {
                if (err) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    res.write("Got error :-( " + err);
                    res.end("");
                    return;
                }

                var newregistration = data[0].Updated_By;

                //res.send(id);
                //var username = id.UserName;
                //console.log(UserName);
                request.input('Membership_ID', sql.NVarChar(60), contactid);
                // console.log("1. Contact ID = " + contactid);

                request.input('First_Name', sql.NVarChar(255), id.First_Name);
                // console.log("2. First = " + id.First_Name);

                request.input('Last_Name', sql.NVarChar(255), id.Last_Name);
                //console.log("3. Last = " + id.Last_Name);

                request.input('Job_Title', sql.NVarChar(255), id.Job_Title);
                // console.log("4. Job Title = " + id.Job_Title);

                request.input('Email', sql.NVarChar(255), id.Email);
                // console.log("5. Email = " + id.Email);

                request.input('Phone', sql.NVarChar(15), id.Phone);
                // console.log("5. Email = " + id.Phone);

                request.input('Agency', sql.NVarChar(255), id.Agency);
                console.log("6. Agency = " + id.Agency);

                request.input('County', sql.NVarChar(255), county);
                console.log(" County = " + county);

                request.input('Active', sql.Int, id.Active);
                console.log("7. Status = " + id.Active);

                request.input('User_Role', sql.NVarChar(255), id.User_Role);
                console.log("8. Role = " + id.User_Role);


                request.input('Updated_By', sql.NVarChar(255), req.user.name);
                console.log("10. Updated By = " + req.user.name);

                console.log('should be executing');

                request.execute('[dbo].[sp_UpdateMember]', function(err, recordsets, returnValue) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('executing');
                    console.log(returnValue + " Procedure Code");
                    if (err)
                        return next(err, null);
                    if (returnValue === 0)
                        console.log("Should be updated");

                    //Notify user that their account has been activated
                    if (activeStatus === 1 && newregistration === 'New Registration') {
                        //send new user signup email to user
                        // systememail.transport.sendMail({
                        //     from: 'mziyam@mtc.ca.gov',
                        //     //to:  req.param('email'),
                        //     to: id.userEmail,
                        //     subject: 'Plan Bay Area Registration',
                        //     text: id.userFirstName + ' ' + id.userLastName + ', your Plan Bay Area account has been activated. Please visit http://projects.planbayarea.org to login and manage your Plan Bay Area projects.'
                        // });
                    }
                    //Sends Alert Message to Page with Tag id="alert-projects" Message is the second param. 1st param is page
                    //req.flash('users', 'User Successfully Updated!');
                    // res.end();
                    //res.redirect('/useraccount');

                    var response = {
                        'status': 'success'
                    };

                    res.json(response);


                });

            });

        }
    });


};


/**
 * Get my info
 */
exports.me = function(req, res, next) {
 
    var userId = req.user.membershipid;

    // console.log(userId);
    //bcrypt to check password???
    var query = "Select * FROM dbo.AppMembership where Membership_ID='" + userId + "'";
    var request = new sql.Request(config.mssql.connection);
    request.query(query, function(err, user) {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Got error :-( " + err);
            res.end("");
            return;
        }
        if (!user) {
            return res.status(401).send('Unauthorized');
        }
        console.log(user);
        var newUser = {
            "membershipid": user[0].membershipid,
            "role": user[0].User_Role,
            "First_Name": user[0].First_Name,
            "Last_Name": user[0].Last_Name,
            "Job_Title": user[0].Job_Title,
            "Phone": user[0].Phone,
            "Agency": user[0].Agency,
            "Email": user[0].Email,
            "name": user[0].First_Name + " " + user[0].Last_Name
        }
        res.json(newUser);

    })

};

//Update My Account
exports.myAccount = function(req, res, next) {
    //Get agency URL parameter
    var username = req.user.name;
    console.log(req.user);
    var agency = req.user.agency;
    var memberid = req.user.membershipid;
    var id = req.body;
    console.log(id);

    var request = new sql.Request(config.mssql.connection);
    //If user is from MTC, load all projects. Otherwise filter projects based on agency

    request.input('Membership_ID', sql.NVarChar(60), memberid);
    request.input('First_Name', sql.NVarChar(255), id.First_Name);
    request.input('Last_Name', sql.NVarChar(255), id.Last_Name);
    request.input('Job_Title', sql.NVarChar(255), id.Job_Title);
    request.input('Email', sql.NVarChar(255), id.Email);
    request.input('Phone', sql.NVarChar(15), id.Phone);
    request.input('Updated_By', sql.NVarChar(255), req.user.name);
    request.execute('[dbo].[sp_UpdateUser]', function(err, recordsets, returnValue) {
        if (err) {
            console.log(err);
        }
        console.log('executing');
        console.log(returnValue + " Procedure Code");
        if (err)
            return next(err, null);
        if (returnValue === 0)
            console.log("Should be updated");


        //Sends Alert Message to Page with Tag id="alert-projects" Message is the second param. 1st param is page
        // req.flash('users', 'Account Successfully Updated!');
        // res.end();
        res.json({
            'response': 'success'
        });


    });
};


//Update My Account Password
//Reset Password
exports.myPwd = function(req, res, next) {
    var username = req.user.name;
    var agency = req.user.agency;
    var memberid = req.user.membershipid;
    var id = req.body;
    console.log(id);

    var request = new sql.Request(config.mssql.connection);

    //Generate new password hash and save to database
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(id.pwd1, salt, function(err, hash) {
            console.log(hash); // Store hash in your password DB.
            request.input('Membership_ID', sql.NVarChar(60), memberid);
            request.input('Updated_By', sql.NVarChar(255), username);
            request.input('Password_Hash', sql.NVarChar(60), hash);
            request.execute('[dbo].[sp_UpdatePassword]', function(err, recordsets, returnValue) {
                //console.log(err);
                //console.log(returnValue);
                if (err)
                    return done(err, null);
                if (returnValue === 0)
                    console.log("success");
                //Sends Alert Message to Page with Tag id="alert-projects" Message is the second param. 1st param is page
                res.json({
                    'response': 'success'
                });

            });
        });
    });

};

//Update User Password
//Reset Password
exports.pwd = function(req, res, next) {
    var updatedby = req.user.name;
    var memberid = req.params.id;
    var id = req.body;
    console.log(id);

    var request = new sql.Request(config.mssql.connection);

    //Generate new password hash and save to database
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(id.pwd1, salt, function(err, hash) {
            console.log(hash); // Store hash in your password DB.
            request.input('Membership_ID', sql.NVarChar(60), memberid);
            request.input('Updated_By', sql.NVarChar(255), updatedby);
            request.input('Password_Hash', sql.NVarChar(60), hash);
            request.execute('[dbo].[sp_UpdatePassword]', function(err, recordsets, returnValue) {
                //console.log(err);
                //console.log(returnValue);
                if (err)
                    return done(err, null);
                if (returnValue === 0)
                    console.log("success");
                //Sends Alert Message to Page with Tag id="alert-projects" Message is the second param. 1st param is page
                res.json({
                    'response': 'success'
                });

            });
        });
    });

};



//Delete User
exports.destroy = function(req, res, next) {
    var id = req.params.id;
    var request = new sql.Request(config.mssql.connection);
    request.input('MembershipID', sql.NVarChar(60), id);
    request.execute('[dbo].[sp_DeleteMember]', function(err, recordsets, returnValue) {
        //console.log(err);
        console.log(returnValue);
        if (err)
            return next(err, null);
        if (returnValue === 0)

            res.json({
            status: 'success'
        });

    });

};



/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};
