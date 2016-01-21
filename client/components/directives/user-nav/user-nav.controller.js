'use strict';

angular.module('testApp')
	.controller('UsernavCtrl',['$scope',  '$location', 'Auth', '$timeout',
		function($scope, $location, Auth, $timeout){
			
			//VArs
			$scope.isCollapsed = true;
			$scope.navActive = false;
	    
	        $scope.menu = [{
	            'title': 'Home',
	            'link': '/'
	        }];
	
	        $scope.main = [{
	            'title': 'Explore',
	            'link': '/#/#section-1'
	        }, {
	            'title': 'About the Plan',
	            'link': '/#/#section-2'
	        }, {
	            'title': 'About MTC',
	            'link': '/#/#section-3'
	        }];
	
	        $scope.items = [{
	            'title': 'My Projects',
	            'link': '/viewprojects'
	        }, {
	            'title': 'Create Project',
	            'link': '/createproject'
	        }, {
	            'title': 'Import Projects',
	            'link': '/importprojects'
	        }, {
	            'title': 'Search Projects',
	            'link': '/searchprojects'
	        }, {
	            'title': 'About',
	            'link': '/about'
	        }, {
	            'title': 'Help',
	            'link': '/help'
	        }, {
	            'title': 'Feedback',
	            'link': '/feedback'
	        }, {
	            'title': 'My Account',
	            'link': '/myaccount'
	        }];
	
	
	        // $scope.isCollapsed = true;
	        $scope.isLoggedIn = Auth.isLoggedIn;
	        $scope.isAdmin = Auth.isAdmin;
	        $scope.getCurrentUser = Auth.getCurrentUser;
	
	        $scope.logout = function() {
	            Auth.logout();
	            $location.path('/login');
	            //$scope.navActive = false;
	        };
	
	        $scope.isActive = function(route) {
	            return route === $location.path();
	        };
	        
	        $scope.navLoader = function(){
		        $timeout(function(){
			        $scope.navActive = true;
		        }, 1000);
		        console.log("called");
	        };
	        
	        $scope.navLoader();
		}
	]
);