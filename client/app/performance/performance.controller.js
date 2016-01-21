'use strict';

angular.module('testApp')
    .controller('PerformanceCtrl', ['$scope', '$http', 'performance', '$location', '$state', 'Modal',
        function($scope, $http, performance, $location, $state, Modal) {
            var params = $location.search();
            // $scope.viewMode = false;
            // $scope.editMode = false;


            // Reload projects function
            var refresh = function getPerformance() {
                performance.getPerformance(params)
                    .success(function(response) {
                        //Add response to table row collection
                        $scope.rowCollection = response;
                        $scope.agency = {};
                    })
                    .error(function(error) {
                        $scope.status = 'Unable to load project data: ' + error.message;
                    });
            };

            refresh();

        }
    ]);
