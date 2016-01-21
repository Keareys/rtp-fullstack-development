'use strict';

angular.module('testApp')
    .controller('SystememailCtrl', function($scope, Modal, systememail) {

        /*
        COMPONENTS
        Services: Modal, systememail
        Modals: systemEmail
         */

        /**
         * [emailModal - Adds email modal to scope]
         * @param  {[object]} email
         */
        $scope.emailModal = Modal.confirm.systemEmail(function(email) { // callback when modal is confirmed
            console.log(email);
            $scope.sendEmail(email);
            $scope.getEmailList();
            console.log('done');
        });
        // Eno modal definition


        /**
         * [sendEmail Sends email based on information entered in email Modal]
         * @param  {[object]} email [Email title, message and recipients from modal input]
         */
        $scope.sendEmail = function(email) {
            systememail.sendEmail(email).success(function(response) {
                console.log(response);
            }).error(function(error) {
                console.log(error);
            });
        };

        /**
         * [sendEmailModal Opens the email modal on click event]
         */
        $scope.sendEmailModal = function() {
            $scope.newEmail = {};
            $scope.emailModal($scope.newEmail);
        };

        /**
         * [getEmailList Gets a list of sent emails]
         */
        $scope.getEmailList = function() {
            systememail.getEmails().success(function(response) {
                console.log(response);
                for (var i = response.length - 1; i >= 0; i--) {
                    var categories = response[i].EmailID;
                    var momentdate = moment(response[i].date);
                    var startdate = momentdate.format('YYYY-MM-DD');
                    console.log(startdate);
                    var title = response[i].Title;
                    console.log(startdate, title);
                    $scope.getStats(categories, startdate);

                }

                $scope.emails = response;
            }).error(function(error) {
                console.log(error);
            });
        };

        $scope.getEmailList();

        /**
         * [getStats Gets statistics for sent emails from sendgrid]
         * @param  {[type]} category [rtp]
         * @param  {[type]} date     [date range]
         */
        $scope.getStats = function(category, date) {
            $scope.stats = [];
            systememail.getEmailStats(category, date).success(function(response) {
                // console.log(response);
                $scope.stats = response[0].stats[0].metrics;
                console.log($scope.stats);
            }).error(function(error) {
                console.log(error);
            });
        };


    });
