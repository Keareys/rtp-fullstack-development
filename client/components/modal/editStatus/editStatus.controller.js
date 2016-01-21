'use strict';

angular.module('testApp')
    .controller('StatusModalCtrl', function($scope, status) {
        console.log($scope);
        console.log($scope.modal.project);

        $scope.updateStatus = function() {
            console.log($scope.modal.project);
            $scope.newStatus = {
                notes: $scope.modal.project[0].notes
            };
            status.updateStatus($scope.modal.newStatus).success(function(response) {
                console.log(response);
                $scope.$dismiss();
            }).error(function(error) {
                console.log(error);
            });
        };
    });
