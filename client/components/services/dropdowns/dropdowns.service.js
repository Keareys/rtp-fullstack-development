'use strict';

angular.module('testApp')
    .service('dropdowns', function(baseurl, $http) {
        var urlBase = '/api/dropdowns';
        var mainURL = baseurl.baseURL();
        urlBase = mainURL + urlBase;

        this.getCounties = function() {
            return $http.get(urlBase + '/counties');
        };

        this.getAgencies = function() {
            return $http.get(urlBase + '/agencies');
        };

        this.getRoles = function() {
            return $http.get(urlBase + '/roles');
        };

         this.getCommittedFunding = function() {
            return $http.get(urlBase + '/committedFunding');
        };


    });
