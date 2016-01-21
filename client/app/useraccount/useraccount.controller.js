'use strict';

angular.module('testApp')
    .controller('UseraccountCtrl', ['$scope', '$http', 'users', '$location', 'Modal', 'dropdowns', function($scope, $http, users, $location, Modal, dropdowns) {


        /*
        COMPONENTS
        Services: users, Modal, dropdowns
        Modals: editUser, editPassword, delete
         */

        /*
        Global Variables
         */
        var params = $location.search();

        /*
        Modals - components/modal/modal.service.js
         */
        /**
         * [userModal - Shows user modal on click event]
         * @param  {[object]} user) 
         */
        $scope.userModal = Modal.confirm.editUser(function(user) { // callback when modal is confirmed
            //$location.path("/login"); //will redirect to login page, make sure your controller is using $location
            //console.log($scope.state);
            console.log(user);
            $scope.updateUser(user.Membership_ID, user);

            console.log('done');
        });

        /**
         * [userPwdModal - Shows user password modal on click event]
         * @param  {[object]} userinfo) 
         */
        $scope.userPwdModal = Modal.confirm.editPassword(function(userinfo) { // callback when modal is confirmed
            console.log(userinfo);
            $scope.updatePwd(userinfo);
        });

        /**
         * [userDelModal - Shows user delete confirmation modal on click event]
         * @param  {[string]} User ID) 
         */
        $scope.userDelModal = Modal.confirm.delete(function(id) { // callback when modal is confirmed
            $scope.removeUser($scope.membershipid);
            console.log('done');
        });



        /**
         * [editUser, editPwd, delUser  Click events for opening modals]
         */
        $scope.editUser = function(id) {
            $scope.userModal(id);
        };

        $scope.editPwd = function(id) {
            $scope.userinfo = {
                membershipid: id,
            };
            $scope.userPwdModal($scope.userinfo);
        };

        $scope.delUser = function(id) {
            $scope.membershipid = id;
            $scope.userDelModal(id);
        };


        /**
         * [refresh Gets a list of registered users]
         * @paramter {[object]} [scope.names]
         */
        var refresh = function getUsers() {
            users.getUsers(params)
                .success(function(response) {
                    // console.log(response);
                    $scope.names = response;
                    $scope.agency = {};
                })
                .error(function(error) {
                    $scope.status = 'Unable to load project data: ' + error.message;
                });
        };

        refresh();

        /**
         * [updateUser Updates general user information. Adds notification on success]
         * @param  {[string]} id   [User ID]
         * @param  {[object]} user [User info]
         */
        $scope.updateUser = function(id, user) {
            console.log(id);
            console.log('this is the id');
            users.updateUser(id, user)
                .success(function(response) {
                    $.notify({
                        // options
                        icon: 'fa fa-pencil fa-2x',
                        message: 'User successfully updated'
                    }, {
                        // settings
                        type: 'success',
                        animate: {
                            enter: 'animated fadeInDown',
                            exit: 'animated fadeOutUp'
                        },
                        placement: {
                            from: "top",
                            align: "center"
                        }
                    });
                    refresh();
                })
                .error(function(error) {
                    $scope.status = 'Unable to delete user: ' + error.message;
                });
        };

        /**
         * [removeUser Deletes a user. Adds notification on success]
         * @param  {[string]} id   [User ID]
         */
        $scope.removeUser = function(id) {
            console.log(id);
            users.deleteUser(id)
                .success(function(response) {
                    console.log(response);
                    refresh();
                })
                .error(function(error) {
                    $scope.status = 'Unable to delete user: ' + error.message;
                });
        };

        /**
         * [updatePwd Updates user password. Adds notification on success]
         * @param  {[string]} pwd   [User ID]
         */
        $scope.updatePwd = function(pwd) {
            users.updatePassword(pwd)
                .success(function(response) {
                    $.notify({
                        // options
                        icon: 'fa fa-pencil fa-2x',
                        message: 'User password successfully updated'
                    }, {
                        // settings
                        type: 'success',
                        animate: {
                            enter: 'animated fadeInDown',
                            exit: 'animated fadeOutUp'
                        },
                        placement: {
                            from: "top",
                            align: "center"
                        }
                    });
                    refresh();
                })
                .error(function(error) {
                    $scope.status = 'Unable to delete user: ' + error.message;
                });
        };


    }]);
