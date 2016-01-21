'use strict';

angular.module('testApp')
	.directive('usernavTemplate', function(){
		return {
			retrict: 'E',
			controller:'UsernavCtrl',
			templateUrl: 'components/directives/user-nav/user-nav.html'
		};
	});