'use strict';

angular.module('testApp')
    .service('status', function($http, baseurl) {

        var urlBase = '/api/status';
        var mainURL = baseurl.baseURL();
        urlBase = mainURL + urlBase;
        this.getStatus = function(projectid) {
            return $http.get(urlBase + '/' + projectid);
        };

        this.statusList = function() {
            return $http.get(urlBase);
        };

        this.updateStatus = function(proj) {
            console.log(proj);
            return $http.post(urlBase + '/' + proj.projectid, proj);
        };

        this.updateMapStatus = function(projid, status) {
            console.log(status);
            return $http.post(urlBase + '/mapstatus/' + projid, status);
        };

    });
