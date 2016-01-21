'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('systememail', {
        url: '/systememail',
        templateUrl: 'app/systememail/systememail.html',
        controller: 'SystememailCtrl',
        isAdmin: true
      });
  });