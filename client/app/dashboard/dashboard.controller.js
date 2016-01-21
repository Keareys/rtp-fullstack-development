'use strict';

angular.module('testApp')
    .controller('DashboardCtrl', function($scope, dashboard, sessions, projects) {
        /*
         COMPONENTS
         Services: dashboard, sessions, projects
         */

        /**
         * [refresh Loads all summary data for use on the dashboard]
         */
        var refresh = function() {
            // Load Users info
            $scope.getMembership = dashboard.getMembershipDashboard().success(function(response) {
                $scope.membership = response;

            }).error(function(error) {
                console.log(error);
            });
            // Load project info
            $scope.getProjects = dashboard.getProjectsDashboard().success(function(response) {
                $scope.projects = response;
            }).error(function(error) {
                console.log(error);
            });

            // Load session info
            $scope.getSessions = dashboard.getSessionsDashboard().success(function(response) {
                $scope.sessions = response;
            }).error(function(error) {
                console.log(error);
            });

            // load errors info
            $scope.getErrors = dashboard.getErrorsDashboard().success(function(response) {
                $scope.errors = response;
            }).error(function(error) {
                console.log(error);
            });

            // load messages info
            $scope.getMessages = dashboard.getMessagesDashboard().success(function(response) {
                $scope.messages = response;
            }).error(function(error) {
                console.log(error);
            });

            // load messages info
            $scope.getActiveSessions = sessions.getSessions().success(function(response) {
                console.log(response);
                $scope.activeSessions = response[0].onlineUsers;
                console.log($scope.activeSessions);
            }).error(function(error) {
                console.log(error);
            });

            $scope.getList = projects.getListNames().success(function(response) {
                $scope.listNames = response;
            }).error(function(error) {
                console.log(error);
            });
        };
        //Load all data
        refresh();

        /**
         * [clearSessions Clears all active sessions]
         */
        $scope.clearSessions = function() {
            sessions.clearSessions().success(function(response) {
                console.log(response);
                refresh();
            }).error(function(error) {
                console.log(error);
            });
        };
    });
