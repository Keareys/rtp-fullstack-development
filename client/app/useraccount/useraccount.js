'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('useraccount', {
        url: '/useraccount',
        templateUrl: 'app/useraccount/useraccount.html',
        controller: 'UseraccountCtrl',
        authenticate: true
      });
  });