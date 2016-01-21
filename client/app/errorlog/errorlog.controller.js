'use strict';

angular.module('testApp')
    .controller('ErrorlogCtrl', function($scope, errors) {
        $scope.isLoading = true;

        /**
         * [loadErrors Get list of site errors]
         * @variable {[object]} [scope.errors]
         */
        $scope.loadErrors = function() {
            errors.getErrors().success(function(response) {
                $scope.errors = response;
                $scope.isLoading = false;
            }).error(function(error) {
                console.log(error);
            });
        };

        $scope.loadErrors();

        /**
         * [updateError Sets error read flag to true]
         * @param  {[type]} id [Error ID]
         */
        $scope.updateError = function(id) {
            errors.updateError(id).success(function(response) {
                console.log(response);
                $scope.loadErrors();
            }).error(function(error) {
                console.log(error);
            });
        };
    });
