'use strict';

angular.module('testApp')
    .controller('ViewprojectsnewCtrl', ['$scope', '$http', 'projects', 'messages', '$location', '$state', 'Modal', 'status', 'performance', 'dropdowns',
        function ($scope, $http, projects, messages, $location, $state, Modal, status, performance, dropdowns) {

            /*
            Services: Projects, Messages, Status
            Modals: ProjectHistory, ProjectMessages, UpdateStatus, ProjectList
            Libraries: lodash
            Contents:
            1. Global Variables
            2. Modals
            3. Lists
            4. Projects
            5. Misc. (Date picker, Notify, Populate Dropdowns)
             */

            ////
            // 1. GLOBAL VARIABLES
            ////
            $scope.isLoading = true;
            $scope.isSaveGeneralChanges = false;
            $scope.isSaveCostScheduleChanges = false;
            $scope.isSaveFundingChanges = false;
            $scope.isSaveDetailedCostChanges = false;
            $scope.isSaveContacts = false;
            $scope.list = {};
            $scope.listProjects = [];
            $scope.selectedProjectIds = [];
            $scope.isList = false;
            //Get any url paramters
            var params = $location.search();
            console.log(params.length);

            //Notifications
            var icon, message, title, type, url;

            // Set default view and edit modes
            $scope.viewMode = false;
            $scope.editMode = false;

            ////
            // 2. MODALS
            ////
            //Add history modal to scope
            $scope.showHistoryModal = Modal.confirm.projectHistory(function (events) { // callback when modal is confirmed
                console.log(events);
            });

            //Add messages modal to scope
            $scope.showMessagesModal = Modal.confirm.projectMessages(function (messages) { // callback when modal is confirmed
                console.log(messages);
            });

            //Add status modal to scope
            $scope.showStatusModal = Modal.confirm.updateStatus(function (status) { // callback when modal is confirmed
                console.log(status);
            });


            //Add project list modal to scope
            $scope.showProjectList = Modal.confirm.projectList(function (list) { // callback when modal is confirmed
                console.log(list);
                projects.insertList(list).success(function (response) {
                    console.log(response);
                }).error(function (error) {
                    console.log(error);
                });
            });

            /**
             * [openMessageModal Opens messages modal when in map view]
             */
            $scope.openMessageModal = function () {
                // Show hide message modal divs
                $scope.sendMessageMode = false;
                $scope.showMessagesModal($scope.projectid);

            };

            /**
             * [openStatusModal: Opens Change Status modal when in project view mode]
             */
            $scope.openStatusModal = function () {
                // Show hide message modal divs
                // $scope.sendMessageMode = false;
                $scope.showStatusModal($scope.projectDetails);

            };

            /**
             * [openProjectList Opens the project list modal]
             */
            $scope.openProjectList = function () {
                // Show hide message modal divs
                // $scope.sendMessageMode = false;
                $scope.showProjectList($scope.list);

            };

            ////
            // 3. LISTS
            ////

            //Get list names
            projects.getListNames().success(function (response) {
                $scope.listNames = response;
            }).error(function (error) {
                console.log(error);
            });

            /**
             * Function
             * [removeFromList: Removes a project from a given list]
             * @param  {[type]} id [Project_ID]
             * @param  {[list]} id [List_ID]
             */
            $scope.removeFromList = function (id) {
                var list = {
                    listId: $scope.listId
                };
                projects.removeFromList(id, list).success(function (response) {
                    console.log(response);
                    $scope.refresh();
                }).error(function (error) {
                    console.log(error);
                });
            };

            /**
             * Function
             * [addToList Shows the add to list modal and populates the dropdown list with list names]
             * @param {[type]} id    [Project_ID]
             * @param {[type]} title [Project_Title]
             */
            $scope.addToList = function (id, title) {
                projects.getListNames().success(function (response) {
                    $scope.list = {
                        projectId: id,
                        title: title,
                        listNames: response
                    };
                    $scope.showAddProjectList($scope.list);
                }).error(function (error) {
                    console.log(error);
                });
            };

            /* 
            Add To Project List
            Show project list modal when project is selected from view grid. When modal is completed, add project to appropriate list
             */
            $scope.showAddProjectList = Modal.confirm.addProjectList(function (list) { // callback when modal is confirmed
                //console.log(list);
                $scope.listId = list.listId;
                var updateList = {};
                updateList = {
                    Project_ID: list.projectId,
                    List_ID: list.listId
                };
                console.log('this is the update list');
                console.log(updateList);
                projects.insertIntoList(updateList).success(function (response) {
                    console.log(response);
                    if (response.response === 'Exists') {
                        icon = 'fa fa-warning fa-2x';
                        message = 'Project has already been added to this list! <br> Click here to view list';
                        title = 'Warning';
                        type = 'warning';
                        url = 'viewprojectsnew?listId=' + $scope.listId;

                        //Add notification
                        notify(icon, title, message, type, url);
                    } else {
                        icon = 'fa fa-pencil fa-2x';
                        message = 'Click here to view list';
                        title = 'Project Successfully Added';
                        type = 'success';
                        url = 'viewprojectsnew?listId=' + $scope.listId;
                        //Add notification
                        notify(icon, title, message, type, url);
                    }
                }).error(function (error) {
                    console.log(error);
                });
            });

            ////
            // 4. PROJECTS
            ////
            /*
            Query project status, set array with timeline classes, and launch status modal
             */
            $scope.showHistory = function (projectid) {
                var events = [];
                var index = 0;
                status.getStatus(projectid).success(function (response) {
                    console.log(response);
                    for (var i = response.length - 1; i >= 0; i--) {
                        if (index === 0) {
                            events.push({
                                'badgeClass': 'default',
                                'badgeIconClass': 'glyphicon-check',
                                'title': response[i].Sponsor_Status,
                                'content': response[i].Status_Change_Notes,
                                'date': response[i].Update_Date
                            });
                            index = 1;
                        } else if (index === 1) {
                            events.push({
                                'badgeClass': 'warning',
                                'badgeIconClass': 'glyphicon-credit-card',
                                'title': response[i].Sponsor_Status,
                                'content': response[i].Status_Change_Notes,
                                'date': response[i].Update_Date
                            });
                            index = 0;
                        }
                        // response[i]
                    }
                    $scope.showHistoryModal(events);
                }).error(function (error) {
                    console.log(error);
                });
            };

            /*
            Query project messages and add them to messages modal
             */
            $scope.showMessages = function (projectid) {
                messages.getMessage(projectid).success(function (response) {
                    // console.log(response);
                    $scope.showMessagesModal(projectid);
                }).error(function (error) {
                    console.log(error);
                });
            };

            /*
            Reload projects function
            Check to see if url parameters contain a ListID, projects counter or no paramters and load projects appropriately
             */
            if (params.listId) {
                //Set Scope ListID
                $scope.listId = params.listId;
                $scope.refresh = function getList() {
                    $scope.isList = true;
                    projects.getList(params.listId)
                        .success(function (response) {
                            $scope.isLoading = false;
                            //Add response to table row collection
                            $scope.rowCollection = response;
                            $scope.pageTitle = 'Project List';
                            $scope.agency = {};
                        })
                        .error(function (error) {
                            $scope.status = 'Unable to load project data: ' + error.message;
                        });
                };
            } else if (params.counter) {
                console.log(params.counter);
                if (params.counter < 1) {
                    console.log('true');
                    $scope.listProjects = [{
                        'Project_ID': params.id0
                    }];
                } else if (params.counter > 0) {
                    for (var i = params.counter - 1; i >= 0; i--) {
                        var indexNumber = 'id' + i;
                        console.log(indexNumber);
                        console.log(params[indexNumber]);
                        $scope.listProjects.push({
                            'Project_ID': params[indexNumber]
                        });
                    }
                }
                console.log($scope.listProjects);
                //Set Scope ListID
                // $scope.listId = params.listId;
                $scope.refresh = function getList() {
                    $scope.isList = true;
                    performance.getBundledProjectDetails($scope.listProjects)
                        .success(function (response) {
                            $scope.isLoading = false;
                            //Add response to table row collection
                            $scope.rowCollection = response;
                            $scope.pageTitle = 'Project List';
                            $scope.agency = {};
                        })
                        .error(function (error) {
                            $scope.status = 'Unable to load project data: ' + error.message;
                        });

                };
            } else {
                $scope.refresh = function getProjects() {
                    projects.getProjects(params)
                        .success(function (response) {
                            $scope.isLoading = false;
                            //Add response to table row collection
                            $scope.rowCollection = response;
                            if (!params.status) {
                                $scope.pageTitle = 'All Projects';
                            } else if (params.status === 'performance') {
                                $scope.pageTitle = 'Performance Projects';
                            } else if (params.status === 'cma') {
                                $scope.pageTitle = 'Projects Submitted to CMA';
                            } else if (params.status === 'mtc') {
                                $scope.pageTitle = 'Projects Submitted to MTC';
                            }
                            $scope.agency = {};
                        })
                        .error(function (error) {
                            $scope.status = 'Unable to load project data: ' + error.message;
                        });
                };
            }

            $scope.refresh();

            /*
            ROW SELECTION
             */

            //Initialize number of selected rows 
            $scope.noRow = 0;

            /**
             * Function
             * [noSelected: On row select, add project_id to array, otherwise remove from array]
             * @param  {[type]} select [true or false if row is selected or not]
             * @param  {[type]} row    [row information]
             * @variable: Adds or removes projectIDs from $scope.selectedProjectIds
             */
            $scope.noSelected = function (select, row) {
                if (select) {
                    $scope.noRow = $scope.noRow + 1;
                    $scope.selectedProjectIds.push({
                        'Project_ID': row.Project_ID
                    });

                } else {
                    $scope.noRow = $scope.noRow - 1;
                    _.remove($scope.selectedProjectIds, { //lodash function
                        Project_ID: row.Project_ID
                    });
                }
                console.log($scope.selectedProjectIds);
            };

            /**
             * Function
             * [getProject: Gets single project details for populating tab panel in view mode. On click in view grid, queries project details, binds data and switches to View state]
             * @param  {[type]} id [Project_ID for the project]
             * @variable $scope.projectDetails [scope variable for two way data binding for inputs in tab panel]
             */
            $scope.getProject = function (id) {
                $scope.projectDetails = [];
                console.log(id);
                projects.getProject(id)
                    .success(function (response) {
                        //$scope.status = 'Deleted Customer! Refreshing customer list.';
                        // $scope.role = {};
                        // console.log(response);
                        $scope.projectDetails = response;
                        $scope.projectid = id;
                        $state.go('viewprojectsnew.view');
                        $scope.viewMode = true;
                        // refresh();
                    })
                    .error(function (error) {
                        console.log(error);
                        // $scope.status = 'Unable to delete customer: ' + error.message;
                    });
            };

            /**
             * Function
             * [getCommittedFunding: Queries endpoint to retrieve list of committed funding sources for a project]
             * @param  {[type]} id [Project_ID]
             */
            $scope.getCommittedFunding = function (id) {
                projects.getCommittedFunding(id)
                    .success(function (response) {
                        $scope.projectCommittedFunding = response;
                    })
                    .error(function (error) {
                        console.log(error);
                        // $scope.status = 'Unable to delete customer: ' + error.message;
                    });
            };

            /**
             * Function
             * [getModelingFiles: Queries endpoint to retrieve list of modeling files associated with a project]
             * @param  {[type]} id [Project_ID]
             */
            $scope.getModelingFiles = function (id) {
                projects.getModelingFiles(id)
                    .success(function (response) {
                        $scope.modelingFiles = response;
                    })
                    .error(function (error) {
                        console.log(error);
                        // $scope.status = 'Unable to delete customer: ' + error.message;
                    });
            };

            /**
             * Function
             * [getProjectDetail: Queries endpoint to retrieve detailed project information to populate project view tab panel]
             * @param  {[type]} id [Project_ID]
             */
            $scope.getProjectDetail = function (id, mode) {
                $scope.projectDetails = [];
                console.log(id);
                projects.getProjectDetail(id)
                    .success(function (response) {
                        //$scope.status = 'Deleted Customer! Refreshing customer list.';
                        // $scope.role = {};
                        // console.log(response);
                        $scope.projectDetails = response;
                        $scope.projectid = id;
                        $scope.getCommittedFunding($scope.projectid);
                        $scope.getModelingFiles($scope.projectid);
                        console.log(mode);
                        if (mode === 'view') {
                            $state.go('viewprojectsnew.view');
                        } else if (mode === 'edit') {
                            $state.go('viewprojectsnew.edit');
                            populateDropdowns();

                        }
                        // $state.go('viewprojectsnew.view');
                        $scope.viewMode = true;
                        // refresh();
                    })
                    .error(function (error) {
                        console.log(error);
                        // $scope.status = 'Unable to delete customer: ' + error.message;
                    });
            };

            /*
             * Updating/Editing Projects
             * Update split into six functions: updateProjectGeneral,
             */

            /**
             * Function
             * [updateProjectGeneral: Updates Card1. General Information]
             * @param  {[variable]} id [Project_ID]
             * @param  {[object]} id [$scope.projectDetails]
             */
            $scope.updateProjectGeneral = function () {
                console.log($scope.projectDetails);
                var id = $scope.projectDetails[0].Project_ID;
                var projectData = $scope.projectDetails;
                projects.updateProjectGeneral(id, projectData)
                    .success(function (response) {
                        console.log(response);
                        icon = 'fa fa-warning fa-2x';
                        message = 'Project information saved to database';
                        title = 'Success!';
                        type = 'success';

                        //Add notification
                        notify(icon, title, message, type, url);
                        $scope.isSaveGeneralChanges = false;
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            };

            /**
             * Function
             * [updateProjectGeneral: Updates Card3. General Information]
             * @param  {[variable]} id [Project_ID]
             * @param  {[object]} id [$scope.projectDetails]
             */
            $scope.updateProjectCostSchedule = function () {
                console.log($scope.projectDetails);
                var id = $scope.projectDetails[0].Project_ID;
                var projectData = $scope.projectDetails;
                projects.updateProjectCostSchedule(id, projectData)
                    .success(function (response) {
                        console.log(response);
                        icon = 'fa fa-warning fa-2x';
                        message = 'Project information saved to database';
                        title = 'Success!';
                        type = 'success';

                        //Add notification
                        notify(icon, title, message, type, url);
                        $scope.isSaveCostScheduleChanges = false;
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            };

            /**
             * Function
             * [updateProjectFunding: Updates Card 4. Funding]
             * @param  {[variable]} id [Project_ID]
             * @param  {[object]} id [$scope.projectDetails]
             */
            $scope.updateProjectFunding = function () {
                console.log($scope.projectDetails);
                var id = $scope.projectDetails[0].Project_ID;
                var projectData = $scope.projectDetails;
                projects.updateProjectFunding(id, projectData)
                    .success(function (response) {
                        console.log(response);
                        icon = 'fa fa-warning fa-2x';
                        message = 'Project information saved to database';
                        title = 'Success!';
                        type = 'success';

                        //Add notification
                        notify(icon, title, message, type, url);
                        $scope.isSaveFundingChanges = false;
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            };

            /**
             * Function
             * [updateProjectDetailCost: Updates Card 6. Detailed Cost]
             * @param  {[variable]} id [Project_ID]
             * @param  {[object]} id [$scope.projectDetails]
             */
            $scope.updateProjectDetailCost = function () {
                console.log($scope.projectDetails);
                var id = $scope.projectDetails[0].Project_ID;
                var projectData = $scope.projectDetails;
                projects.updateProjectDetailCost(id, projectData)
                    .success(function (response) {
                        console.log(response);
                        icon = 'fa fa-warning fa-2x';
                        message = 'Project information saved to database';
                        title = 'Success!';
                        type = 'success';

                        //Add notification
                        notify(icon, title, message, type, url);
                        $scope.isSaveDetailedCostChanges = false;
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            };

            /**
             * Function
             * [updateProjectContacts: Updates Card 7. Contacts]
             * @param  {[variable]} id [Project_ID]
             * @param  {[object]} id [$scope.projectDetails]
             */
            $scope.updateProjectContacts = function () {
                console.log($scope.projectDetails);
                var id = $scope.projectDetails[0].Project_ID;
                var projectData = $scope.projectDetails;
                projects.updateProjectContacts(id, projectData)
                    .success(function (response) {
                        console.log(response);
                        icon = 'fa fa-warning fa-2x';
                        message = 'Project information saved to database';
                        title = 'Success!';
                        type = 'success';

                        //Add notification
                        notify(icon, title, message, type, url);
                        $scope.isSaveContacts = false;
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            };

            /**
             * [saveChanges Sets saveChanges flags to true when there is a change in the edit projects forms. This activates the Save Changes and Discard Changes buttons]
             */
            $scope.saveChanges = function (section) {
                switch (section) {
                case 'general':
                    $scope.isSaveGeneralChanges = true;
                    break;
                case 'costSchedule':
                    $scope.isSaveCostScheduleChanges = true;
                    break;
                case 'funding':
                    $scope.isSaveFundingChanges = true;
                    break;
                case 'detailedCost':
                    $scope.isSaveDetailedCostChanges = true;
                    break;
                case 'contacts':
                    $scope.isSaveContacts = true;
                    break;
                }
            };


            /**
             * [discardChanges Sets isSaveGeneralChanges to false and redirect to view projects grid]
             */
            $scope.discardChanges = function () {
                $scope.isSaveGeneralChanges = false;
                $scope.isSaveCostScheduleChanges = false;
                $scope.isSaveFundingChanges = false;
                $state.go('viewprojectsnew');
            };

            /**
             * Function
             * [mapProject: Load map page after setting global variables mapMode, editMode, Tool_Type]
             * @param  {[type]} id   [Project_ID]
             * @param  {[type]} mode [true, false]
             * @param  {[type]} type [Tool_Type = line, point, poly]
             */
            $scope.mapProject = function (id, mode, type) {
                $scope.projectid = id;
                $scope.mapMode = true;
                $scope.editMapMode = mode;
                $scope.Tool_Type = type;
                $state.go('viewprojectsnew.map');
            };

            /**
             * [reloadProjects: reloads/refreshes the projects table]
             */
            $scope.reloadProjects = function () {
                $scope.pageTitle = 'Loading Projects...';
                $scope.refresh();
            };


            ////
            // 5. MISC.
            ////

            /**
             * [config Configuration for scroll bars on the page]
             * @type {Object}
             */
            $scope.config = {
                autoHideScrollbar: false,
                theme: 'dark-2',
                advanced: {
                    updateOnContentResize: true
                },
                setHeight: 200,
                scrollInertia: 0,
                axis: 'y'
            };

            /**
             * [resetMode: Sets all project modes to false when clicking on 'Back to Projects']
             */
            $scope.resetMode = function () {
                $scope.viewMode = false;
                $scope.editMode = false;
                $scope.mapMode = false;
            };

            /**
             * [populateDropdowns Populates all the dropdowns when project is in edit mode]
             */
            function populateDropdowns() {
                //Get agencies dropdown list
                dropdowns.getAgencies().success(function (response) {
                    $scope.agencies = response;
                }).error(function (error) {
                    console.log(error);
                });

                //Get counties dropdown list
                dropdowns.getCounties().success(function (response) {
                    $scope.counties = response;
                }).error(function (error) {
                    console.log(error);
                });

                //Get committed funding dropdown list
                dropdowns.getCommittedFunding().success(function (response) {
                    $scope.committedFundingSources = response;
                }).error(function (error) {
                    console.log(error);
                });

            }

            /**
             * Function
             * [notify Adds notification to view based on parameters]
             * @param  {[type]} icon    [icon to be show with notification - font awesome]
             * @param  {[type]} title   [title of notification]
             * @param  {[type]} message [main message to be displayed]
             * @param  {[type]} type    [class type. danger, warning, primary etc.]
             * @param  {[type]} url     [url if notification is to be linkable]
             */
            function notify(icon, title, message, type, url) {
                $.notify({
                    // options
                    icon: icon,
                    title: title,
                    message: message,
                    url: url
                }, {
                    // settings
                    type: type,
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    },
                    placement: {
                        from: 'top',
                        align: 'center'
                    }
                });

            }

            // DATE PICKER
            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };

            $scope.toggleMin();
            $scope.maxDate = new Date(2020, 5, 22);

            $scope.openDatePicker = function () {
                $scope.datePopup.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];
            $scope.altInputFormats = ['M!/d!/yyyy'];

            $scope.datePopup = {
                opened: false
            };


        }


    ]);