'use strict';

angular.module('testApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('viewprojects', {
                url: '/viewprojects',
                templateUrl: 'app/viewprojects/viewprojects.html',
                controller: 'ViewprojectsCtrl',
                authenticate: true,
                reloadOnSearch: false
                    // isAdmin: true
            })

        .state('viewprojects.view', {
                views: {
                    'project-content': {
                        templateUrl: 'app/viewprojects/templates/project.view.html',
                        controller: 'ViewprojectsCtrl'
                    }
                }
            })
            .state('viewprojects.edit', {
                views: {
                    'project-content': {
                        templateUrl: 'app/viewprojects/templates/project.edit.html',
                        controller: 'ViewprojectsCtrl'
                    }
                }
            })
            .state('viewprojects.map', {
                views: {
                    'project-content': {
                        templateUrl: 'app/viewprojects/templates/project.map.html',
                        controller: 'Mapprojects1Ctrl'
                    }
                }
            });



    });
