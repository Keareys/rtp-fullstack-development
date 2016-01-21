'use strict';

angular.module('testApp')
    .controller('MyaccountCtrl', function($scope, Auth, users) {
        // $scope.isCollapsed = true;
        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.isAdmin = Auth.isAdmin;
        $scope.getCurrentUser = Auth.getCurrentUser;
        $scope.currentPwd = {};

        var refresh = function() {
            users.me().success(function(response) {
                $scope.currentUser = response;
            }).error(function(error) {
                console.log(error);
            });
        };

        refresh();

        // Update Account
        $scope.updateMyAccount = function() {
            users.updateMyAccount($scope.currentUser).success(function(response) {
                console.log(response);
                //Define notification
                $.notify({
                    // options
                    icon: 'glyphicon glyphicon-warning-sign',
                    title: 'Account Successfully Updated',
                    message: 'Your account has been updated with the information you provided.'

                }, {
                    // settings
                    element: 'body',
                    position: null,
                    type: "success",
                    allow_dismiss: true,
                    newest_on_top: true,
                    showProgressbar: false,
                    placement: {
                        from: "top",
                        align: "center"
                    },
                    offset: 20,
                    spacing: 10,
                    z_index: 1031,
                    delay: 2000,
                    timer: 1000,
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    },
                    icon_type: 'class',
                    template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                        '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                        '<span data-notify="icon"></span> ' +
                        '<span data-notify="title">{1}</span><br> ' +
                        '<span data-notify="message">{2}</span>' +
                        '<div class="progress" data-notify="progressbar">' +
                        '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                        '</div>' +
                        '<a href="{3}" target="{4}" data-notify="url"></a>' +
                        '</div>'
                });
            }).error(function(error) {
                console.log(error);
            });
        };

        // Update Account
        $scope.updateMyPassword = function() {
        	console.log($scope.currentPwd);
            users.updateMyPassword($scope.currentPwd).success(function(response) {
                console.log(response);
                $scope.currentPwd = {};
                //Define notification
                $.notify({
                    // options
                    icon: 'glyphicon glyphicon-warning-sign',
                    title: 'Password Successfully Updated<br>',
                    message: 'Your password has been updated with the information you provided.'

                }, {
                    placement: {
                        from: "top",
                        align: "center"
                    },
                    delay: 2000,
                    timer: 1000,
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    }

                });
            }).error(function(error) {
                console.log(error);
            });
        };
    });
