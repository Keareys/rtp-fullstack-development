'use strict';

angular.module('testApp')
    .service('messages', function($http, baseurl) {
        var urlBase = '/api/messages';
        var mainURL = baseurl.baseURL();
        urlBase = mainURL + urlBase;
        this.getMessages = function() {
            return $http.get(urlBase);
        };

        this.getMessage = function(id) {
            return $http.get(urlBase + '/' + id);
        };

        this.insertMessage = function(proj) {
            return $http.post(urlBase, proj);
        };

        this.updateMessage = function(id) {
            return $http.put(urlBase + '/' + id);
        };

        this.deleteMessage = function(id) {
            return $http.delete(urlBase + '/' + id);
        };
    });
