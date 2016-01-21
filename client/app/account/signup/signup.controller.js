'use strict';

angular.module('testApp')
    .controller('SignupCtrl', function($scope, Auth, $location, $window, dropdowns, users, $state) {
        $scope.user = {};
        $scope.errors = {};
         $scope.registrationHeading = 'New User Registration';

        dropdowns.getAgencies().success(function(response) {
            $scope.agencies = response;
        }).error(function(error) {
            console.log(error);
        });

               $scope.register = function() {
            users.insertUser($scope.user).success(function(response) {
                console.log(response);
                $state.go('signup.success');
                $scope.registrationHeading = 'Thank You!';
            }).error(function(error) {
                console.log(error);
            });
        };

        $scope.loginOauth = function(provider) {
            $window.location.href = '/auth/' + provider;
        };
    });
