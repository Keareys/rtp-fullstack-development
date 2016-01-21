'use strict';

angular.module('testApp')
  .service('baseurl', function () {
    this.baseURL = function() {
           return '';
            // return 'http://rtp-fullstack-api.elasticbeanstalk.com';
        };
  });
