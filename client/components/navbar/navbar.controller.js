/*
'use strict';

angular.module('testApp')
    .controller('NavbarCtrl', function($scope, $location, Auth) {
	    $scope.isCollapsed = true;
	    
        $scope.menu = [{
            'title': 'Home',
            'link': '/'
        }];

        $scope.main = [{
            'title': 'Explore',
            'link': '/'
        }, {
            'title': 'About the Plan',
            'link': '/'
        }, {
            'title': 'About MTC',
            'link': '/'
        }];

        $scope.items = [{
            'title': 'My Projects',
            'link': '/viewprojects'
        }, {
            'title': 'Create Project',
            'link': '/createproject'
        }, {
            'title': 'Project List',
            'link': '/projectlist'
        }, {
            'title': 'Search Projects',
            'link': '/searchprojects'
        }, {
            'title': 'My Account',
            'link': '/myaccount'
        }];
		
		console.log(items[2].title, "asdfasdf");

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
    });
*/
