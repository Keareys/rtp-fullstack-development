'use strict';

angular.module('testApp')
    .service('mapping', function($http, baseurl) {
        var urlBase = '/api/mapping';
        var mainURL = baseurl.baseURL();
        urlBase = mainURL + urlBase;
        this.updateXY = function(xy) {
            return $http.post(urlBase + '/xy', xy);
        };

        this.updateLRS = function(lrs) {
            return $http.post(urlBase + '/lrs', lrs);
        };


    });
