'use strict';

angular.module('testApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('myaccount', {
                url: '/myaccount',
                templateUrl: 'app/account/myaccount/myaccount.html',
                controller: 'MyaccountCtrl',
                authenticate: true
            });
    });
