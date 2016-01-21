'use strict';

angular.module('testApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('bundles', {
                url: '/bundles',
                templateUrl: 'app/bundles/bundles.html',
                controller: 'BundlesCtrl'
            })
            .state('bundles.view', {
                views: {
                    'project-content': {
                        templateUrl: 'app/bundles/templates/bundle.project.html',
                        controller: 'BundlesCtrl'
                    }
                }
            });
    });
