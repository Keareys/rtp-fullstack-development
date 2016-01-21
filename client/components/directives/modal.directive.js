'use strict';

angular.module('testApp')
	.directive("modalTemplate", function(){
		return {
			retrict: 'E',
			controller:'ModalCtrl',
			controllerAs: 'modal',
			templateUrl: 'components/directives/modal.directive.html'
		}
	});