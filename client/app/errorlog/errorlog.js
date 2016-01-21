'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('errorlog', {
        url: '/errorlog',
        templateUrl: 'app/errorlog/errorlog.html',
        controller: 'ErrorlogCtrl',
        isAdmin: true
      });
  });