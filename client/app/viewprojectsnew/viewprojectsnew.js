'use strict';

angular.module('testApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('viewprojectsnew', {
                url: '/viewprojectsnew',
                templateUrl: 'app/viewprojectsnew/viewprojectsnew.html',
                controller: 'ViewprojectsnewCtrl',
                authenticate: true,
                reloadOnSearch: false
                    // isAdmin: true
            })

        .state('viewprojectsnew.view', {
                views: {
                    'project-content': {
                        templateUrl: 'app/viewprojectsnew/templates/project.view.html',
                        controller: 'ViewprojectsnewCtrl'
                    }
                }
            })
            .state('viewprojectsnew.edit', {
                views: {
                    'project-content': {
                        templateUrl: 'app/viewprojectsnew/templates/project.edit.html',
                        controller: 'ViewprojectsnewCtrl'
                    }
                }
            })
            .state('viewprojectsnew.map', {
                views: {
                    'project-content': {
                        templateUrl: 'app/viewprojectsnew/templates/project.map.html',
                        controller: 'Mapprojects1Ctrl'
                    }
                }
            });



    });