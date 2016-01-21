'use strict';

angular.module('testApp')
    .service('projects', function($http, baseurl) {

        var urlBase = '/api/projects';
        var mainURL = baseurl.baseURL();
        urlBase = mainURL + urlBase;
        this.getProjects = function(params) {
            console.log(params);
            if (params.status) {
                var string = '?status=' + params.status;
                return $http.get(urlBase + string);
            } else if (params.projectid) {
                var string = '?projectid=' + params.projectid;
                console.log(string);
                return $http.get(urlBase + string);
            }
            return $http.get(urlBase);
        };

        // Get specific project
        this.getProject = function(id) {
            return $http.get(urlBase + '/' + id);
        };

        // Get project details
        this.getProjectDetail = function(id) {
            return $http.get(urlBase + '/detail/' + id);
        };

        //Get project details for map view
        this.getProjectMapDetail = function(id) {
            return $http.get(urlBase + '/mapdetail/' + id);
        };

        //Create new project
        this.insertProject = function(proj) {
            return $http.post(urlBase, proj);
        };
        //Update project
        this.updateProject = function(proj) {
            return $http.put(urlBase + '/' + proj.ID, proj);
        };
        //Delete project
        this.deleteProject = function(id) {
            return $http.delete(urlBase + '/' + id);
        };
        //Update, insert or delete map feature
        this.updateMapFeature = function(id, feature) {
            return $http.post(urlBase + '/feature/' + id, feature);
        };
        //Update, insert or delete map feature
        this.addMapFeature = function(id, feature) {
            return $http.post(urlBase + '/addfeature/' + id, feature);
        };

        //Update, insert or delete map feature
        this.updateToolType = function(id, tool) {
            return $http.post(urlBase + '/tooltype/' + id, tool);
        };
        //Returns modeling files associated with a project
        this.getModelingFiles = function(id) {
            return $http.get(urlBase + '/modelingfiles/' + id);
        };

        this.getCurrentUser = function() {
            return $http.get(urlBase + '/me');
        };

        this.getEmails = function(id) {
            return $http.get(urlBase + '/emails/' + id);
        };

        this.getList = function(id) {
            return $http.get(urlBase + '/projectList/' + id);
        };

        this.getListNames = function() {
            return $http.get(urlBase + '/listNames');
        };

        this.insertList = function(list) {
            return $http.post(urlBase + '/insertList', list);
        };

        this.removeList = function(id) {
            return $http.post(urlBase + '/removeList/' + id);
        };

        this.insertIntoList = function(list) {
            console.log('insert service');
            console.log(list);
            return $http.post(urlBase + '/insertIntoList', list);
        };

        this.removeFromList = function(id, list) {
            return $http.post(urlBase + '/removeFromList/' + id, list);
        };

        //Get committed funding for a project
        this.getCommittedFunding = function(id) {
            return $http.get(urlBase + '/committedFunding/' + id);
        };

        this.updateProjectContacts = function(id, project) {
            return $http.post(urlBase + '/updateProjectContacts/' + id, project);
        };

        this.updateProjectCostSchedule = function(id, project) {
            return $http.post(urlBase + '/updateProjectCostSchedule/' + id, project);
        };

        this.updateProjectDetailCost = function(id, project) {
            return $http.post(urlBase + '/updateProjectDetailCost/' + id, project);
        };

        this.updateProjectFunding = function(id, project) {
            return $http.post(urlBase + '/updateProjectFunding/' + id, project);
        };

        this.updateProjectGeneral = function(id, project) {
            return $http.post(urlBase + '/updateProjectGeneral/' + id, project);
        };

        this.updateProjectModeling = function(id, project) {
            return $http.post(urlBase + '/updateProjectModeling/' + id, project);
        };


    });
