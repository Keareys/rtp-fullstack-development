'use strict';

angular.module('testApp')
	.directive('navTemplate', function(){
		return {
			retrict: 'E',
			controller:'NavCtrl',
			templateUrl: 'components/directives/nav/nav.directive.html'
		}
	});