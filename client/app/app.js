'use strict';

angular.module('testApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'angularModalService',
        'smart-table',
        'ngScrollbars',
        'angular-timeline'
    ])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        $urlRouterProvider.otherwise('/');
        // $urlRouterProvider.when('/dashboard','/dashboard');

        $locationProvider.html5Mode(true);
        $httpProvider.interceptors.push('authInterceptor');
    })

.factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
        // Add authorization token to headers
        request: function (config) {
            config.headers = config.headers || {};
            if ($cookieStore.get('token')) {
                config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
            }
            return config;
        },

        // Intercept 401s and redirect you to login
        responseError: function (response) {
            if (response.status === 401) {
                $location.path('/login');
                // remove any stale tokens
                $cookieStore.remove('token');
                return $q.reject(response);
            } else {
                return $q.reject(response);
            }
        }
    };
})

.run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
        Auth.isLoggedInAsync(function (loggedIn) {
            if (next.authenticate && !Auth.isLoggedIn()) {
                Auth.logout();
                $location.path('/login');
            }
            if (next.isAdmin && !Auth.isAdmin()) {
                Auth.logout();
                $location.path('/login');
            }
        });
    });
});