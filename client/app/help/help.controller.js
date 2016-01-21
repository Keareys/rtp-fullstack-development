'use strict';

angular.module('testApp')
    .controller('HelpCtrl', ['$scope', '$http', 'projects', '$location', function($scope, $http, projects, $location) {
        var params = $location.search();
        var refresh = function getProjects() {
            projects.getProjects(params)
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

        //Add delete record function to application scope
        $scope.getProject = function(id) {
            projects.getProject(id)
                .success(function(response) {
                    //$scope.status = 'Deleted Customer! Refreshing customer list.';
                    // $scope.role = {};
                    console.log(response);
                    $scope.projectDetails = response;
                    refresh();
                })
                .error(function(error) {
                    $scope.status = 'Unable to delete customer: ' + error.message;
                });
        };

    }]);
