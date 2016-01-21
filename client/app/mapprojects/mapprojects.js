'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mapprojects', {
        url: '/mapprojects',
        templateUrl: 'app/mapprojects/mapprojects.html',
        controller: 'MapprojectsCtrl',
        authenticate: true
      });
  });