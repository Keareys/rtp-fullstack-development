'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('projectlist', {
        url: '/projectlist',
        templateUrl: 'app/projectlist/projectlist.html',
        controller: 'ProjectlistCtrl'
      });
  });