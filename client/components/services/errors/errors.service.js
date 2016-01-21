'use strict';

angular.module('testApp')
    .service('errors', function($http, baseurl) {
        var urlBase = '/api/errors';
        var mainURL = baseurl.baseURL();
        urlBase = mainURL + urlBase;
        
        this.getErrors = function() {
            return $http.get(urlBase);
        };

        this.updateError = function(id) {
            return $http.post(urlBase + '/' + id);
        };

       
    });
