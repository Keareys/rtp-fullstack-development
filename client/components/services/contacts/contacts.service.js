'use strict';

angular.module('testApp')
    .service('contacts', function($http, baseurl) {
        var urlBase = '/api/contacts';
        var mainURL = baseurl.baseURL();
        urlBase = mainURL + urlBase;
        // var urlBase = 'http://rtp-fullstack-api.elasticbeanstalk.com/api/status';

        this.getMessageContactList = function() {
            return $http.get(urlBase + '/messages');
        };

        this.statusList = function() {
            return $http.get(urlBase);
        };

        this.updateStatus = function(proj) {
            return $http.put(urlBase + '/' + proj.ID, proj);
        };

        this.updateMapStatus = function(projid, status) {
            var body = {
                "status": status
            };
            return $http.put(urlBase + '/mapstatus/' + projid, body);
        };
    });
