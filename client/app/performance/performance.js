'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('performance', {
        url: '/performance',
        templateUrl: 'app/performance/performance.html',
        controller: 'PerformanceCtrl',
        isAdmin: true
      });
  });