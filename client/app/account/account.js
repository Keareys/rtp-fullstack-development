'use strict';

angular.module('testApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/account/login/login.html',
                controller: 'LoginCtrl'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'app/account/signup/signup.html',
                controller: 'SignupCtrl'
            })
            .state('signup.success', {
                views: {
                    'signup-content': {
                        templateUrl: 'app/account/signup/templates/signup.success.html',
                        controller: 'SignupCtrl'
                    }
                },
                url: '/success'

            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'app/account/settings/settings.html',
                controller: 'SettingsCtrl',
                authenticate: true
            });
    });
