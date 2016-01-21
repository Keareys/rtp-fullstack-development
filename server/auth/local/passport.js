var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var sql = require('mssql');
var config = require('./../../config/environment');
var bcrypt = require('bcryptjs');
var uuid = require('node-uuid');

exports.setup = function(User, config) {
    passport.use(new LocalStrategy({
            passReqToCallback: true,
            usernameField: 'email',
            passwordField: 'password' // this is the virtual field on the model
        },
        // asynchronous
        // User.findOne wont fire unless data is sent back
        // console.log(username, password);
        function(req, email, password, done) {
            // console.log(email, password);

            //query database for user and password
            var request = new sql.Request(config.mssql.connection);
            request.query("SELECT * FROM [dbo].[Membership_VW] WHERE Email='" + email + "'", function(err, user) {
                console.log(user.length);
                //Error handling
                if (err) {
                    console.log(err);
                    return done(err, null);
                }
                //If no user found
                if (user.length === 0) {
                    console.log("no active user");
                    //Sends Alert Message to Page with Tag id="alert-projects" Message is the second param. 1st param is page
                    //  req.flash('user_found', 'No account was found associated with this email address. Please use the Register link to create an account.');
                    return done(null, null,{
                        message: 'This email address has not been registered'
                    });
                }
                //If user found but not yet active
                else if (user && user[0].Active === 0) {
                    console.log("no active user");
                    //Sends Alert Message to Page with Tag id="alert-projects" Message is the second param. 1st param is page
                    // req.flash('user_found', 'Your account has not yet been activated. Please Contact Adam Noelting (anoelting@mtc.ca.gov) if your account is not active within the next 24 hours.');
                    return done(null, null, {
                        message: 'Your account has not been activated'
                    });
                }


                //Compare password hash and return user 
                bcrypt.compare(password, user[0].Password_Hash, function(err, res) {
                    console.log(res);
                    if (res === true) {
                        //         //Send Text message
                        //     console.log("sending message");
                        // client.create(
                        //     'sms_messages', {
                        //         "From": "(440) 540-4848",
                        //         "To": "+19169967909",
                        //         "Body": user[0].Email + " just logged in!"
                        //     },
                        //     function(response) { // SUCCESS CALLBACK
                        //         util.log("SMS successfully sent. SMS SID: " + response.sid);
                        //     },
                        //     function(error) { // ERROR CALLBACK
                        //         util.log(JSON.stringify(error));
                        //     });
                        // //End Text Message

                        return done(null, {
                            name: user[0].Email,
                            role: user[0].User_Role,
                            agency: user[0].Agency,
                            firstname: user[0].First_Name,
                            lastname: user[0].Last_Name,
                            county: user[0].County,
                            membershipid: user[0].Membership_ID
                        });
                    } else if (res === false) {
                        console.log("wrong password");
                        //Sends Alert Message to Page with Tag id="alert-projects" Message is the second param. 1st param is page
                        // req.flash('user_found', 'Your password was incorrect. Please try logging in again.');
                        return done(null, null);
                    }
                });

            });
        }));


};

exports.register = function(config) {
    passport.use('local-signup', new LocalStrategy({
            passReqToCallback: true
        },

        function(req, username, password, done) {
           

            var params = [];
            console.log(req.body);

            //var newUsername = username;
            var newPasswordhash;
            var newUser = {
                name: req.param('email'),
                id: req.param('email'),

            };
            var membershipid = uuid.v1();

            var request = new sql.Request(config.mssql.connection);
            //Check to see if email/user already exists
            var queryString = "SELECT * from dbo.Membership_VW WHERE Email = '" + req.param('email') + "'";
            request.query(queryString, function(err, data) {
                console.log(data);
                if (err) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    res.write("Got error :-( " + err);
                    res.end("");
                    return;
                } else if (data.length > 0) {
                    //Send message saying user already exists
                    req.flash('user_found', "The email account " + req.param('email') + " already exists. Please login with this email account or create a new account.");
                    return done(null, null);


                } else {
                    request.query("SELECT * FROM dbo.Agency_LU Where Agency_Name = '" + req.body.agency + "'", function(err, agencyLU) {
                        if (err) {
                            console.log(err);
                        } else if (agencyLU) {
                            console.log(agencyLU[0].Role);
                            console.log(agencyLU[0].County);

                            bcrypt.genSalt(10, function(err, salt) {
                                bcrypt.hash(password, salt, function(err, hash) {
                                    console.log(hash); // Store hash in your password DB.
                                    request.input('Membership_ID', sql.NVarChar(60), membershipid);
                                    request.input('First_Name', sql.NVarChar(255), req.param('firstname'));
                                    request.input('Last_Name', sql.NVarChar(255), req.param('lastname'));
                                    request.input('Job_Title', sql.NVarChar(255), req.param('jobtitle'));
                                    request.input('Email', sql.NVarChar(100), req.param('email'));
                                    request.input('Phone', sql.NVarChar(100), req.param('phone'));
                                    request.input('Agency', sql.NVarChar(255), req.param('agency'));
                                    request.input('County', sql.NVarChar(255), agencyLU[0].County);
                                    request.input('Password_Hash', sql.NVarChar(60), hash);
                                    request.input('User_Role', sql.NVarChar(255), agencyLU[0].Role);
                                    request.input('Updated_By', sql.NVarChar(255), "New Registration");

                                    request.execute('[dbo].[sp_InsertNewMember]', function(err, recordsets, returnValue) {
                                        //console.log(err);
                                        //console.log(returnValue);
                                        if (err) {
                                            console.log(err);
                                            return done(err, null);
                                        }
                                        if (returnValue === 0)
                                            console.log("success");



                                        //Send message to client
                                        //Sends Alert Message to Page with Tag id="alert-projects" Message is the second param. 1st param is page
                                        req.flash('user_found', 'Thank you for registering with Plan Bay Area. You will receive an email once your account has been activated!');
                                        console.log('this is the email list');
                                        console.log(getEmailAlertList('New User'));

                                        //send new user signup email to admin
                                        systememail.transport.sendMail({
                                            from: 'mziyam@mtc.ca.gov',
                                            //to:  req.param('email'),
                                            to: newRegistrationList,
                                            subject: 'Plan Bay Area: New User Registration',
                                            text: req.param('firstname') + ' ' + req.param('lastname') + ' has successfully registered. Please login to assign a role. '
                                        });

                                        //send new user signup email to user
                                        systememail.transport.sendMail({
                                            from: 'mziyam@mtc.ca.gov',
                                            //to:  req.param('email'),
                                            to: req.param('email'),
                                            subject: 'Plan Bay Area Registration',
                                            text: req.param('firstname') + ' ' + req.param('lastname') + ', thank you for registering with the new Plan Bay Area website. Your account is currently being reviewed and you will receive an email when it has been activated. If you do not receive an activation email within the next 24 hours, please contact Adam Noelting (anoelting@mtc.ca.gov).'
                                        });

                                        return done(null, newUser);

                                    });
                                });
                            });

                        }
                    });




                }


            });

            // set the user's local credentials
            // newUser.local.username = username;

        }));
}
