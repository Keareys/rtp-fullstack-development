'use strict';

angular.module('testApp')
    .service('dashboard', function($http, baseurl) {
        var urlBase = '/api/dashboard';
        var mainURL = baseurl.baseURL();
        urlBase = mainURL + urlBase;
        this.getMembershipDashboard = function() {
            return $http.get(urlBase + '/membership');
        };

        this.getProjectsDashboard = function() {
            return $http.get(urlBase + '/projects');
        };

         this.getTotalProjectsDashboard = function() {
            return $http.get(urlBase + '/totalprojects');
        };

        this.getErrorsDashboard = function() {
            return $http.get(urlBase + '/errors');
        };

        this.getSessionsDashboard = function() {
            return $http.get(urlBase + '/sessions');
        };

        this.getMessagesDashboard = function() {
            return $http.get(urlBase + '/messages');
        };

    });
