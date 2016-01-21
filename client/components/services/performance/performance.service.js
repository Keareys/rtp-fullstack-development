'use strict';

angular.module('testApp')
    .service('performance', function($http, baseurl) {
        var urlBase = '/api/performance';
        var mainURL = baseurl.baseURL();
        urlBase = mainURL + urlBase;

        var projectIds = [];

        //Get list of projects in a bundle
        this.getBundledProjects = function(id) {
            return $http.get(urlBase + '/bundledProjects/' + id);
        };

        //Get bundle list
        this.getPerformance = function() {
            return $http.get(urlBase);
        };
        this.getPerformanceCOCs = function(id) {
            return $http.get(urlBase + '/getPerformanceCOCs/' + id);
        };
        this.getPerformancePDAs = function(id) {
            return $http.get(urlBase + '/getPerformancePDAs/' + id);
        };
        this.getPerformanceHOAs = function(id) {
            return $http.get(urlBase + '/getPerformanceHOAs/' + id);
        };
        this.getPerformanceTPAs = function(id) {
            return $http.get(urlBase + '/getPerformanceTPAs/' + id);
        };
        //Get bundle list
        this.getBundledProjectFeatures = function(id) {
            console.log(id);
            return $http.post(urlBase + '/bundledProjectFeatures', id);
        };

        //Get bundle list
        this.getBundledProjectDetails = function(id) {
            console.log(id);
            return $http.post(urlBase + '/showBundleProjects', id);
        };


        //Get bundle list
        this.getProjectIds = function(id) {
            console.log(id);
            if (id) {
                projectIds = id;
                return projectIds;
            } else {
                return projectIds;
            }
           
        };

        // this.insertProject = function(proj) {
        //     return $http.post(urlBase, proj);
        // };

        // this.updateProject = function(proj) {
        //     return $http.put(urlBase + '/' + proj.ID, proj)
        // };

        // this.deleteProject = function(id) {
        //     return $http.delete(urlBase + '/' + id);
        // };
    });
