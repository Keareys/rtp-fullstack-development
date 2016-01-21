'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('feedbackreview', {
        url: '/feedbackreview',
        templateUrl: 'app/feedbackreview/feedbackreview.html',
        controller: 'FeedbackreviewCtrl'
      });
  });