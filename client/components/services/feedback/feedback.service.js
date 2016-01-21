'use strict';

angular.module('testApp')
    .service('feedback', function($http, baseurl) {
        var urlBase = '/api/feedback';
        var mainURL = baseurl.baseURL();
        urlBase = mainURL + urlBase;
        //Insert new feedback
        this.create = function(feedback) {
            return $http.post(urlBase + '/create', feedback);
        };

        //Get list
        this.getList = function() {
            return $http.get(urlBase + '/');
        };

         //Add to issues
        this.addIssue = function(issue) {
            return $http.post(urlBase + '/issues', issue);
        };

    });
