'use strict';

angular.module('testApp')
    .service('sessions', function($http, baseurl) {
        var urlBase = '/api/sessions';
        var mainURL = baseurl.baseURL();
        urlBase = mainURL + urlBase;
        this.getSessions = function() {
            return $http.get(urlBase);
        };

        this.clearSessions = function() {
            return $http.get(urlBase + '/clear');
        };
    });
