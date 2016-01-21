'use strict';

angular.module('testApp')
    .controller('ProjectlistCtrl', function($scope, projects, Modal) {
        $scope.list = {};
        
        //Modals
        //Add project list modal to scope
        $scope.showProjectList = Modal.confirm.projectList(function(list) { // callback when modal is confirmed
            console.log(list);
            projects.insertList(list).success(function(response) {
                console.log(response);
            }).error(function(error) {
                console.log(error);
            });
        });

        var refresh = function() {
            projects.getListNames().success(function(response) {
                $scope.listNames = response;
            }).error(function(error) {
                console.log(error);
            });
        };

        refresh();

        $scope.showProjects = function(id) {
            projects.getList(id).success(function(response) {
                $scope.projectList = response;
            }).error(function(error) {
                console.log(error);
            });
        };

        //Remove a project from a list
        $scope.removeFromList = function(id, listId) {
            $scope.listId = listId;
            var list = {
                listId: listId
            };
            projects.removeFromList(id, list).success(function(response) {
                $scope.showProjects($scope.listId);
            }).error(function(error) {
                console.log(error);
            });
        };

        //Delete a list
        $scope.removeList = function(listId) {
            $scope.listId = listId;
            projects.removeList(listId).success(function(response) {
                refresh();
            }).error(function(error) {
                console.log(error);
            });
        };

        $scope.openProjectList = function() {
            // Show hide message modal divs
            // $scope.sendMessageMode = false;
            $scope.showProjectList($scope.list);

        };
		
		$scope.setActive = function(event){
			var finder = document.getElementsByClassName('inner-box');
			console.log(event.target, finder);
		};
    });
