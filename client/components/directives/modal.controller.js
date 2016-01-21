'use strict';

angular.module('testApp')
	.controller('ModalCtrl',[
		'$scope', 
		function($scope){
			$scope.errorList = [
				{
					current: '404',
					//misc: "408",
					misc: "401"
				}
			];
	
			$scope.error = $scope.errorList[0];
			
			$scope.launchModal = function(){
				$("#rtp-modal").modal();
			}
			//Clear modal
			$scope.clearModal = function(){
				$('.current-error').html('');
			}
	
			$scope.showError = function(){
				//To do
			}
			$scope.showError();
			
		}
	]
);