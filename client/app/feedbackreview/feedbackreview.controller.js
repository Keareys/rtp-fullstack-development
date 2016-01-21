'use strict';

angular.module('testApp')
    .controller('FeedbackreviewCtrl', function($scope, feedback) {
        $scope.feedbacklist = {};

        /**
         * [refresh Gets list of feedback items]
         * @variable {[object]} [scope.feedbacklist]
         */
        $scope.refresh = function() {
            feedback.getList().success(function(response) {
                $scope.feedbacklist = response;
            }).error(function(error) {
                console.log(error);
            });
        };

        $scope.refresh();

        /**
         * [addToIssues Adds feedback item as a github issue]
         * @param {[type]} recid   [Feedback ID]
         * @param {[type]} comment [Feedback comment]
         * @param {[type]} page    [Applicaton Page]
         */
        $scope.addToIssues = function(recid, comment, page) {
            $scope.issue = {
                recid: recid,
                comment: comment,
                page: page
            };
            feedback.addIssue($scope.issue).success(function(response) {
                console.log(response);
                $scope.refresh();
            }).error(function(error) {
                console.log(error);
            });
        };

    });
