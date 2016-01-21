'use strict';

angular.module('testApp')
    .controller('FeedbackCtrl', function($scope, feedback) {
        // Initialize feedback object
        $scope.feedBack = {};

        /**
         * [submitFeedback Inserts new feedback into DB and shows notification]
         * @return {[type]} [description]
         */
        $scope.submitFeedback = function() {
            console.log('running submit');
            feedback.create($scope.feedBack).success(function(response) {
                console.log(response);
                //Add notification
                $.notify({
                    // options
                    message: 'Thank you for your feedback!'
                }, {
                    // settings
                    type: 'success',
                    placement: {
                        from: "top",
                        align: "center"
                    },
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    }
                });

                $scope.feedBack = {};
            }).error(function(error) {
                console.log(error);
            });
        };
    });
