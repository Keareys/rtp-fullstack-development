'use strict';

angular.module('testApp')
	.controller('NavCtrl',['$scope',  '$location', 'Auth',
		function($scope, $location, Auth){
			$scope.isCollapsed = true;
	    
	        $scope.menu = [{
	            'title': 'Home',
	            'link': '/'
	        }];
	
	        $scope.main = [{
	            'title': 'Explore',
	            'link': '/#section-1'
	        }, {
	            'title': 'About the Plan',
	            'link': '/#section-2'
	        }, {
	            'title': 'About MTC',
	            'link': '/section-3'
	        }];
	
	        $scope.items = [{
	            'title': 'Projects',
	            'link': '/viewprojects'
	        }, {
	            'title': 'Manage Users',
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
	        
	        $scope.items2 = [{
	            'title': 'My Projects',
	            'link': '/viewprojects'
	        }, {
	            'title': 'My Messages',
	            'link': '/messages'
	        }, {
            	'title': 'Manage Users',
            	'link': '/useraccount'
        	},  {
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
	        };
	
	        $scope.isActive = function(route) {
	            return route === $location.path();
	        };
	        
	        console.log($scope.items[2].title, "asdfasdf");
		}
	]
);