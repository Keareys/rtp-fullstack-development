'use strict';

angular.module('testApp')
    .controller('MessagesPageCtrl', function($scope, $http, Auth, messages, Modal) {

        /*
         COMPONENTS
         Services: Auth,  messages and Modal
         Modals: systemEmail
         */

        /*
        Global Variables
         */
        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.isAdmin = Auth.isAdmin;
        $scope.getCurrentUser = Auth.getCurrentUser;


        /*
        Modals
         */
        /**
         * [showMessagesModal - Shows messages modal on click]
         * @param  {[object]} messages  
         */
        $scope.showMessagesModal = Modal.confirm.projectMessages(function(messages) { // callback when modal is confirmed
            console.log('these are the messages');
            console.log(messages);
            $scope.refresh();
        });

        /**
         * [refresh Loads project messages]
         * @variable {[object]} [scope.names]
         */
        $scope.refresh = function() {
            messages.getMessages().success(function(response) {
                $scope.names = response;
            }).error(function(error) {
                console.log(error);
            });
        };


        /**
         * [updateMessage Updates message read flag to true]
         * @param  {[string]} id [Message ID]
         */
        $scope.updateMessage = function(id) {
            messages.updateMessage(id).success(function(response) {
                console.log(response);
                $scope.refresh();
            }).error(function(error) {
                console.log(error);
            });
        };


        /**
         * [showMessages Gets a list of messages by project and adds them to messages modal]
         * @param  {[string]} projectid [Project ID]
         */
        $scope.showMessages = function(projectid) {
            messages.getMessage(projectid).success(function(response) {
                // console.log(response);
                $scope.showMessagesModal(projectid);
            }).error(function(error) {
                console.log(error);
            });
        };

        $scope.refresh();

    });
