'use strict';

angular.module('testApp')
    .factory('Modal', function($rootScope, $uibModal, messages) {
        /**
         * Opens a modal
         * @param  {Object} scope      - an object to be merged with modal's scope
         * @param  {String} modalClass - (optional) class(es) to be applied to the modal
         * @return {Object}            - the instance $uibModal.open() returns
         */
        function openModal(scope, modalClass) {
            var modalScope = $rootScope.$new();
            scope = scope || {};
            modalClass = modalClass || 'modal-default';

            angular.extend(modalScope, scope);

            return $uibModal.open({
                templateUrl: 'components/modal/modal.html',
                windowClass: modalClass,
                scope: modalScope
            });
        }


        function openUserModal(scope, modalClass) {
            var modalScope = $rootScope.$new();
            scope = scope || {};
            modalClass = modalClass || 'modal-default';

            angular.extend(modalScope, scope);

            return $uibModal.open({
                templateUrl: 'components/modal/editUserModal/modal.html',
                windowClass: modalClass,
                scope: modalScope
            });
        }

        function openUserPasswordModal(scope, modalClass) {
            var modalScope = $rootScope.$new();
            scope = scope || {};
            modalClass = modalClass || 'modal-default';

            angular.extend(modalScope, scope);

            return $uibModal.open({
                templateUrl: 'components/modal/editUserModal/modalPassword.html',
                windowClass: modalClass,
                scope: modalScope
            });
        }



        function openStatusModal(scope, modalClass) {
            var modalScope = $rootScope.$new();
            scope = scope || {};
            modalClass = modalClass || 'modal-default';

            angular.extend(modalScope, scope);

            return $uibModal.open({
                templateUrl: 'components/modal/editStatus/modal.html',
                controller: 'StatusModalCtrl',
                windowClass: modalClass,
                scope: modalScope
            });
        }

        function openpojectHistory(scope, modalClass) {
            var modalScope = $rootScope.$new();
            scope = scope || {};
            modalClass = modalClass || 'modal-default';

            angular.extend(modalScope, scope);

            return $uibModal.open({
                templateUrl: 'components/modal/projectHistory/modal.html',
                windowClass: modalClass,
                scope: modalScope
            });
        }

        function openMessages(scope, modalClass) {
            console.log(scope);
            var modalScope = $rootScope.$new();
            scope = scope || {};
            modalClass = modalClass || 'modal-default';

            angular.extend(modalScope, scope);

            return $uibModal.open({
                templateUrl: 'components/modal/messages/messages.html',
                controller: 'MessagesCtrl',
                windowClass: modalClass,
                scope: modalScope
            });
        }

        function openSystemEmail(scope, modalClass) {
            console.log(scope);
            var modalScope = $rootScope.$new();
            scope = scope || {};
            modalClass = modalClass || 'modal-default';

            angular.extend(modalScope, scope);

            return $uibModal.open({
                templateUrl: 'components/modal/systememail/modal.html',
                // controller: 'MessagesCtrl',
                windowClass: modalClass,
                scope: modalScope
            });
        }

        function openProjectList(scope, modalClass) {
            console.log(scope);
            var modalScope = $rootScope.$new();
            scope = scope || {};
            modalClass = modalClass || 'modal-default';

            angular.extend(modalScope, scope);

            return $uibModal.open({
                templateUrl: 'components/modal/projectList/modal.html',
                // controller: 'MessagesCtrl',
                windowClass: modalClass,
                scope: modalScope
            });
        }

        //Allows user to add a project to an existing project list
        function openAddProjectList(scope, modalClass) {
            console.log(scope);
            var modalScope = $rootScope.$new();
            scope = scope || {};
            modalClass = modalClass || 'modal-default';

            angular.extend(modalScope, scope);

            return $uibModal.open({
                templateUrl: 'components/modal/addProjectList/modal.html',
                // controller: 'MessagesCtrl',
                windowClass: modalClass,
                scope: modalScope
            });
        }

        //Shows bundled project list and map
        function openBundledProjects(scope, modalClass) {
            console.log(scope);
            var modalScope = $rootScope.$new();
            scope = scope || {};
            modalClass = modalClass || 'modal-default app-modal-window';

            angular.extend(modalScope, scope);

            return $uibModal.open({
                templateUrl: 'components/modal/bundledProjects/modal.html',
                controller: 'BundledProjectsCtrl',
                windowClass: 'modal-default app-modal-window',
                size: 'lg',
                scope: modalScope
            });
        }

        // Public API here
        return {

            /* Confirmation modals */
            confirm: {

                /**
                 * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
                 * @param  {Function} del - callback, ran when delete is confirmed
                 * @return {Function}     - the function to open the modal (ex. myModalFn)
                 */
                delete: function(del) {
                    del = del || angular.noop;

                    /**
                     * Open a delete confirmation modal
                     * @param  {String} name   - name or info to show on modal
                     * @param  {All}           - any additional args are passed straight to del callback
                     */
                    return function() {
                        var args = Array.prototype.slice.call(arguments),
                            name = args.shift(),
                            deleteModal;

                        deleteModal = openModal({
                            modal: {
                                dismissable: true,
                                title: 'Confirm Delete',
                                html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
                                buttons: [{
                                    classes: 'btn-danger',
                                    text: 'Delete',
                                    click: function(e) {
                                        deleteModal.close(e);
                                    }
                                }, {
                                    classes: 'btn-default',
                                    text: 'Cancel',
                                    click: function(e) {
                                        deleteModal.dismiss(e);
                                    }
                                }]
                            }
                        }, 'modal-danger');

                        deleteModal.result.then(function(event) {
                            del.apply(event, args);
                        });
                    };
                },
                editUser: function(cb, userObject) { //my new modal
                    cb = cb || angular.noop;
                    return function() {
                        var args = Array.prototype.slice.call(arguments),
                            user = args.shift(), //This is whatever value you pass in when calling the modal
                            theModal;
                        console.log(user);
                        theModal = openUserModal({ //openModal is a function the modal service defines.  It is just a wrapper for $uibModal
                            modal: {
                                dismissable: true,
                                title: 'Update User ' + user.First_Name + ' ' + user.Last_Name,
                                user: user,
                                userObject: userObject,
                                html: 'Are you sure you want to delete this', //set the modal message here, name is the parameter we passed in
                                buttons: [{ //this is where you define you buttons and their appearances
                                    classes: 'btn-warning',
                                    text: 'Cancel',
                                    click: function(event) {
                                        theModal.dismiss(event);
                                    }
                                }, {
                                    classes: 'btn-primary',
                                    text: 'Update',
                                    click: function(event) {
                                        theModal.close(event);
                                    }
                                }, ]
                            }
                        }, 'modal-primary');
                        theModal.result.then(function(event) {
                            console.log(event);
                            console.log(user);
                            cb(user);
                        });
                    };
                },
                editPassword: function(cb, userObject) { //my new modal
                    cb = cb || angular.noop;
                    return function() {
                        var args = Array.prototype.slice.call(arguments),
                            userinfo = args.shift(), //This is whatever value you pass in when calling the modal
                            theModal;
                        console.log(userinfo);
                        theModal = openUserPasswordModal({ //openModal is a function the modal service defines.  It is just a wrapper for $uibModal
                            modal: {
                                dismissable: true,
                                title: 'Update Password',
                                userinfo: userinfo,
                                userObject: userObject,
                                html: 'Are you sure you want to delete this', //set the modal message here, name is the parameter we passed in
                                buttons: [{ //this is where you define you buttons and their appearances
                                    classes: 'btn-warning',
                                    text: 'Cancel',
                                    click: function(event) {
                                        theModal.dismiss(event);
                                    }
                                }, {
                                    classes: 'btn-primary',
                                    text: 'Update',
                                    click: function(event) {
                                        theModal.close(event);
                                    }
                                }, ]
                            }
                        }, 'modal-primary');
                        theModal.result.then(function(event) {
                            console.log(event);
                            console.log(userinfo);
                            cb(userinfo);
                        });
                    };
                },
                projectHistory: function(cb) { //my new modal
                    cb = cb || angular.noop;
                    return function() {
                        var args = Array.prototype.slice.call(arguments),
                            events = args.shift(), //This is whatever value you pass in when calling the modal
                            theModal;
                        console.log(events);
                        theModal = openpojectHistory({ //openModal is a function the modal service defines.  It is just a wrapper for $uibModal
                            modal: {
                                dismissable: true,
                                title: 'Project History',
                                events: events
                            }
                        }, 'modal-primary');
                        theModal.result.then(function(event) {
                            cb.apply(event, args);
                        });
                    };
                },
                projectMessages: function(cb) { //my new modal
                    cb = cb || angular.noop;
                    return function() {
                        var args = Array.prototype.slice.call(arguments),
                            messages = args.shift(), //This is whatever value you pass in when calling the modal
                            theModal;
                        console.log(messages);
                        theModal = openMessages({ //openModal is a function the modal service defines.  It is just a wrapper for $uibModal
                            modal: {
                                dismissable: true,
                                title: 'Message History',
                                //messages: messages,
                                projectid: messages,
                                sendMessageMode: false,
                                buttons: [{ //this is where you define you buttons and their appearances
                                    classes: 'btn-warning',
                                    text: 'Cancel',
                                    click: function(event) {
                                        theModal.dismiss(event);
                                    }
                                }, {
                                    classes: 'btn-primary',
                                    text: 'Send',
                                    click: function(event, messagebody, theModal) {
                                        theModal.close(event);
                                    }
                                }]

                            }
                        }, 'modal-primary');
                        theModal.result.then(function(event) {
                            cb.apply(event, args);
                        });
                    };
                },
                updateStatus: function(cb, projectObj) { //my new modal
                    cb = cb || angular.noop;
                    return function() {
                        var args = Array.prototype.slice.call(arguments),
                            project = args.shift(), //This is whatever value you pass in when calling the modal
                            theModal;
                        console.log(project);
                        theModal = openStatusModal({ //openModal is a function the modal service defines.  It is just a wrapper for $uibModal
                            modal: {
                                dismissable: true,
                                title: 'Update Project Status',
                                project: project,
                                projectObj: projectObj,
                                html: 'Are you sure you want to delete this', //set the modal message here, name is the parameter we passed in
                                buttons: [{ //this is where you define you buttons and their appearances
                                    classes: 'btn-warning',
                                    text: 'Cancel',
                                    click: function(event) {
                                        theModal.dismiss(event);
                                    }
                                }, {
                                    classes: 'btn-primary',
                                    text: 'Update',
                                    click: function(event) {
                                        theModal.close(event);
                                    }
                                }, ]
                            }
                        }, 'modal-primary');
                        theModal.result.then(function(event) {
                            console.log(event);
                            console.log(project);
                            cb(project);
                        });
                    };
                },
                systemEmail: function(cb, emailObj) { //my new modal
                    cb = cb || angular.noop;
                    return function() {
                        var args = Array.prototype.slice.call(arguments),
                            email = args.shift(), //This is whatever value you pass in when calling the modal
                            theModal;
                        console.log(email);
                        theModal = openSystemEmail({ //openModal is a function the modal service defines.  It is just a wrapper for $uibModal
                            modal: {
                                dismissable: true,
                                title: 'New System Email',
                                email: email,
                                emailObj: emailObj,
                                html: 'Are you sure you want to delete this', //set the modal message here, name is the parameter we passed in
                                buttons: [{ //this is where you define you buttons and their appearances
                                    classes: 'btn-warning',
                                    text: 'Cancel',
                                    click: function(event) {
                                        theModal.dismiss(event);
                                    }
                                }, {
                                    classes: 'btn-primary',
                                    text: 'Send',
                                    click: function(event) {
                                        theModal.close(event);
                                    }
                                }, ]
                            }
                        }, 'modal-primary');
                        theModal.result.then(function(event) {
                            console.log(event);
                            console.log(email);
                            cb(email);
                        });
                    };
                },
                projectList: function(cb, listObj) { //my new modal
                    cb = cb || angular.noop;
                    return function() {
                        var args = Array.prototype.slice.call(arguments),
                            list = args.shift(), //This is whatever value you pass in when calling the modal
                            theModal;
                        console.log(list);
                        theModal = openProjectList({ //openModal is a function the modal service defines.  It is just a wrapper for $uibModal
                            modal: {
                                dismissable: true,
                                title: 'New List',
                                list: list,
                                listObj: listObj,
                                html: 'Are you sure you want to delete this', //set the modal message here, name is the parameter we passed in
                                buttons: [{ //this is where you define you buttons and their appearances
                                    classes: 'btn-warning',
                                    text: 'Cancel',
                                    click: function(event) {
                                        theModal.dismiss(event);
                                    }
                                }, {
                                    classes: 'btn-primary',
                                    text: 'Create',
                                    click: function(event) {
                                        theModal.close(event);
                                    }
                                }, ]
                            }
                        }, 'modal-primary');
                        theModal.result.then(function(event) {
                            console.log(event);
                            console.log(list);
                            cb(list);
                        });
                    };
                },
                addProjectList: function(cb, listObj) { //my new modal
                    cb = cb || angular.noop;
                    return function() {
                        var args = Array.prototype.slice.call(arguments),
                            list = args.shift(), //This is whatever value you pass in when calling the modal
                            theModal;
                        console.log(list);
                        theModal = openAddProjectList({ //openModal is a function the modal service defines.  It is just a wrapper for $uibModal
                            modal: {
                                dismissable: true,
                                title: 'Add Project to List',
                                list: list,
                                listObj: listObj,
                                html: 'Are you sure you want to delete this', //set the modal message here, name is the parameter we passed in
                                buttons: [{ //this is where you define you buttons and their appearances
                                    classes: 'btn-warning',
                                    text: 'Cancel',
                                    click: function(event) {
                                        theModal.dismiss(event);
                                    }
                                }, {
                                    classes: 'btn-primary',
                                    text: 'Add to List',
                                    click: function(event) {
                                        theModal.close(event);
                                    }
                                }, ]
                            }
                        }, 'modal-primary');
                        theModal.result.then(function(event) {
                            console.log(event);
                            console.log(list);
                            cb(list);
                        });
                    };
                },
                    bundledProjects: function(cb, projObj) { //my new modal
                    cb = cb || angular.noop;
                    return function() {
                        var args = Array.prototype.slice.call(arguments),
                            project = args.shift(), //This is whatever value you pass in when calling the modal
                            theModal;
                        console.log(project);
                        theModal = openBundledProjects({ //openModal is a function the modal service defines.  It is just a wrapper for $uibModal
                            modal: {
                                dismissable: true,
                                title: 'Add Project to project',
                                project: project,
                                projObj: projObj,
                                html: 'Are you sure you want to delete this', //set the modal message here, name is the parameter we passed in
                                buttons: [{ //this is where you define you buttons and their appearances
                                    classes: 'btn-warning',
                                    text: 'Cancel',
                                    click: function(event) {
                                        theModal.dismiss(event);
                                    }
                                }, {
                                    classes: 'btn-primary',
                                    text: 'Add to project',
                                    click: function(event) {
                                        theModal.close(event);
                                    }
                                }, ]
                            }
                        }, 'modal-primary');
                        theModal.result.then(function(event) {
                            console.log(event);
                            console.log(project);
                            cb(project);
                        });
                    };
                }
            }
        };
    });
