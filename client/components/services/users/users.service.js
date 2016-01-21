'use strict';

angular.module('testApp')
    .service('users', function($http, baseurl) {
        var urlBase = '/api/users';
        var mainURL = baseurl.baseURL();
        urlBase = mainURL + urlBase;
        this.getUsers = function(params) {
            console.log(params);
            if (params) {
                var string = "?status=" + params.status;
                return $http.get(urlBase + string);
            }
            return $http.get(urlBase);
        };

        this.getUser = function(id) {
            return $http.get(urlBase + '/' + id);
        };

        this.me = function() {
            return $http.get(urlBase + '/me');
        };

        this.insertUser = function(user) {
            return $http.post(urlBase, user);
        };

        this.updateUser = function(id, user) {
            return $http.put(urlBase + '/' + id, user);
        };

        this.deleteUser = function(id) {
            return $http.post(urlBase + '/remove/' + id);
        };

        this.updateMyAccount = function(user) {
            console.log(user);
            return $http.post(urlBase + '/myaccount', user);
        };

         this.updateMyPassword = function(pwd) {
            console.log(pwd);
            return $http.post(urlBase + '/mypwd', pwd);
        };

         this.updatePassword = function(pwd) {
            console.log(pwd.membershipid);
            return $http.post(urlBase + '/pwd/' + pwd.membershipid, pwd);
        };
    });
