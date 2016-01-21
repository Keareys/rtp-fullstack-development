'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('messages', {
        url: '/messages',
        templateUrl: 'app/messages/messages.html',
        controller: 'MessagesPageCtrl',
        authenticate: true
      });
  });