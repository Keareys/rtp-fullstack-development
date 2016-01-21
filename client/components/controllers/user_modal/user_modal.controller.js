'use strict';

angular.module('testApp')
    .controller('UserModalCtrl', function($scope, $window, dropdowns) {

        dropdowns.getAgencies().success(function(response) {
            $scope.agencies = response;
        }).error(function(error) {
            console.log(error);
        });

        dropdowns.getRoles().success(function(response) {
            $scope.roles = response;
        }).error(function(error) {
            console.log(error);
        });

        console.log('running user modal directive');
        $scope.tabs = [{
            title: 'Dynamic Title 1',
            content: 'Dynamic content 1'
        }, {
            title: 'Dynamic Title 2',
            content: 'Dynamic content 2'

        }];

        $scope.agencies = [{
            name: 'MTC',
            county: 'Regional'
        }, {
            name: 'MTC',
            county: 'Regional'
        }, {
            name: 'MTC',
            county: 'Regional'
        }, {
            name: 'MTC',
            county: 'Regional'
        }, {
            name: 'MTC',
            county: 'Regional'
        }];

    });
