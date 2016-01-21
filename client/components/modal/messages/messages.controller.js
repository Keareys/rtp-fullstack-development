'use strict';

angular.module('testApp')
    .controller('MessagesCtrl', function($scope, messages, contacts, Modal) {
        //contacts comes from contacts service
        $scope.message = 'Hello';
        console.log($scope.modal.projectid);

        // $scope.newMessage = {
        //     message: 'Testing whether the scope works',
        //     toUser: '4'
        // };

        $scope.sendMessage = function() {
            console.log($scope.newMessage);
            $scope.newMessage.projectid = $scope.modal.projectid;
            console.log($scope.newMessage);
            messages.insertMessage($scope.newMessage).success(function(response) {
                console.log(response);
                $scope.$dismiss('None');
                console.log('success');
            }).error(function(error) {
                console.log(error);
            });
        };
        var refresh = function() {
            messages.getMessage($scope.modal.projectid).success(function(response) {
                $scope.messageList = response;
            }).error(function(error) {
                console.log(error);
            });
        };

        refresh();

        $scope.addNewMessage = function() {
            $scope.modal.sendMessageMode = true;
            contacts.getMessageContactList().success(function(response) {
                $scope.contactList = response;
            }).error(function(error) {
                console.log(error);
            });
        };

        console.log($scope);


    });
