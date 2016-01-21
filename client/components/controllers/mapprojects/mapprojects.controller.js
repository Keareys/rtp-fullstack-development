'use strict';

angular.module('testApp')
    .controller('Mapprojects1Ctrl', function ($scope, $location, projects, performance, status) {
        // Mapprojects1Ctrl is controller for projects.map.html view in /viewprojects/templates

        //Map variables
        var config, el, obj, wkt, leaflet, that;
        var features = [];
        //var parse = require('wellknown');
        //var stringify = require('wellknown');
        $scope.LineTool = false;
        $scope.PointTool = false;
        $scope.newFeature;
        $scope.feature;
        //Show or hide buttons in map mode
        //$scope.mapMode = true;
        console.log($scope.mapMode);
        $scope.editMapMode = false;
        $scope.isMapped = false;
        $scope.projectsGroup = L.featureGroup();
        //Policy Overlays
        $scope.HOAs = new L.LayerGroup();
        $scope.PDAs = new L.LayerGroup();
        $scope.COCs = new L.LayerGroup();
        $scope.TPAs = new L.LayerGroup();
        //Editing Features
        $scope.editFeatureGroup = L.featureGroup();
        $scope.searchresults = L.featureGroup();
        $scope.setBounds = false;
        //* Clears the map contents.        
        $scope.clearMap = function () {
            var i;

            for (i in features) {
                if (features.hasOwnProperty(i)) {
                    $scope.map.removeLayer(features[i]);
                }
            }
            features.length = 0;


        };
        $scope.mapFeature = function (editable, focus) {
            $scope.clearMap();

            //var config, el, obj, wkt;
            // Indicates that the map should pan and/or zoom to new features
            focus = focus || false;


            if (editable === undefined) {
                editable = true;
            }
            performance.getPerformanceHOAs($scope.projectid).success(function (response) {

                //Convert all returned features to leaflet layer and add to feature group
                for (var i = response.length - 1; i >= 0; i--) {
                    if (response[i].PolicyOverlay_WKT) {
                        $scope.setBounds = true;
                        $scope.HOAs.addLayer(returnWKTFeature(response[i].PolicyOverlay_WKT));
                        $scope.HOAs.eachLayer(function (hoa) {
                            hoa.setStyle({
                                color: '#ff9933',
                                weight: 5,
                                opacity: 0.65,
                                fillColor: '#ECECEC',
                                fillOpacity: 0.75
                            });
                        });
                    }
                }
            }).error(function (error) {
                console.log(error);
            });
            performance.getPerformancePDAs($scope.projectid).success(function (response) {

                //Convert all returned features to leaflet layer and add to feature group
                for (var i = response.length - 1; i >= 0; i--) {
                    if (response[i].PolicyOverlay_WKT) {
                        $scope.setBounds = true;
                        $scope.PDAs.addLayer(returnWKTFeature(response[i].PolicyOverlay_WKT));
                        $scope.PDAs.eachLayer(function (pda) {
                            pda.setStyle({
                                color: '#9900cc',
                                weight: 5,
                                opacity: 1,
                                fillColor: '#ECECEC',
                                fillOpacity: 0.75
                            });
                        });
                    }
                }
            }).error(function (error) {
                console.log(error);
            });
            performance.getPerformanceCOCs($scope.projectid).success(function (response) {

                //Convert all returned features to leaflet layer and add to feature group
                for (var i = response.length - 1; i >= 0; i--) {
                    if (response[i].PolicyOverlay_WKT) {
                        $scope.setBounds = true;
                        $scope.COCs.addLayer(returnWKTFeature(response[i].PolicyOverlay_WKT));
                        $scope.COCs.eachLayer(function (coc) {
                            coc.setStyle({
                                color: '#D53D39',
                                weight: 5,
                                opacity: 1,
                                fillColor: '#ECECEC',
                                fillOpacity: 0.75
                            });
                        });
                    }
                }
            }).error(function (error) {
                console.log(error);
            });
            performance.getPerformanceTPAs($scope.projectid).success(function (response) {
                //Convert all returned features to leaflet layer and add to feature group
                for (var i = response.length - 1; i >= 0; i--) {
                    if (response[i].PolicyOverlay_WKT) {
                        $scope.setBounds = true;
                        $scope.TPAs.addLayer(returnWKTFeature(response[i].PolicyOverlay_WKT));
                        $scope.TPAs.eachLayer(function (tpa) {
                            tpa.setStyle({
                                color: '#000099',
                                weight: 5,
                                opacity: 1,
                                fillColor: '#ECECEC',
                                fillOpacity: 0.75
                            });
                        });
                    }
                }
            }).error(function (error) {
                console.log(error);
            });

            // Query database for project id and get WKT_WGS84
            projects.getProjectMapDetail($scope.projectid).success(function (response) {
                //Populate map details based on response
                $scope.mapDetails = response;
                //console.clear();
                //console.log(response);
                //Convert all returned features to leaflet layer and add to feature group
                for (var i = response.length - 1; i >= 0; i--) {
                    if (response[i].WKT_WGS84) {
                        $scope.setBounds = true;
                        $scope.projectsGroup.addLayer(returnWKTFeature(response[i].WKT_WGS84));
                    }

                }
                //                $scope.projectsGroup.eachLayer(function (project) {
                //                                        project.setStyle({
                //                        color: '#2196F3',
                //                        weight: 15,
                //                        opacity: 0.75,
                //                        fillColor: '#ECECEC',
                //                        fillOpacity: 0.75
                //                    });
                //                });
                //Fit map to the extent of the feature group and add it to map
                $scope.projectsGroup.addTo($scope.map);
                if ($scope.setBounds) {
                    $scope.map.fitBounds($scope.projectsGroup.getBounds());
                    var czl = $scope.map.getZoom();

                    if (czl > 19) {
                        $scope.map.setZoom(15);
                    }

                }
                $scope.isMapped = true;
                config = $scope.map.defaults;

                //Leave mapped features with edit mode turned off for now.
                config.editable = false;
                // Add Modeling files if any
                projects.getModelingFiles($scope.projectid).success(function (response) {
                    //console.log(response);
                    $scope.modelingFilesCollection = response;
                }).error(function (error) {
                    console.log(error);
                });
            });
            $scope.projectsGroup.bringToFront();
        };


        //Add Map Tools
        $scope.MapViewRefresh = function () {
            if ($scope.editMapMode) {
                $scope.editFeatureGroup.addTo($scope.map);

                $scope.LineTool = true;
                $scope.PointTool = true;
                $scope.RouteTool = true;
                $scope.drawControl.addTo($scope.map);
                //RteBTN.addTo($scope.map);
                saveBTN.addTo($scope.map);

                saveBTN.disable();

                //RteBTN.disable();
                //On creating a feature, add it to database and refresh map/project view
                $scope.map.on('draw:created', function (e) {
                    saveBTN.enable();
                    console.clear();
                    //console.log(e.layer);
                    var wktFeature = toWKT(e.layer);
                    $scope.newFeature = {
                        WKT_WGS84: wktFeature
                    };

                    // To keep feature editable, uncomment the following line
                    $scope.editFeatureGroup.addLayer(e.layer);
                    //console.log($scope.editFeatureGroup);
                    //console.log($scope.editFeatureGroup.toGeoJSON());
                    $scope.myFeatures = $scope.editFeatureGroup.toGeoJSON();
                    //console.log($scope.myFeatures.features);

                    //console.log($scope.wktFeatures);
                    for (var i = 0; i < $scope.myFeatures.features.length; i++) {
                        $scope.myFeatures.features[i];
                        //console.log(stringify($scope.myFeatures.features[i]));

                        if (i === 0) {
                            //console.log(stringify($scope.myFeatures.features[0]));
                        }
                    }
                });

                // END DRAW
            } else {
                //$scope.editFeatureGroup = L.featureGroup();
            }

        }; //End of MapViewRefresh


        //Initialize map and add to page
        //$scope.addMap = function () {
        leaflet = {
            baseLayers: undefined,
            overlays: undefined
        };
        var Esri_WorldStreetMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
        });
        var OpenStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        var OpenMapSurfer_Roads = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
            maxZoom: 20,
            attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        var MapQuestOpen_OSM = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
            type: 'map',
            ext: 'jpg',
            attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: '1234'
        });
        var MapQuestOpen_Aerial = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
            type: 'sat',
            ext: 'jpg',
            attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
            subdomains: '1234'
        });
        $scope.currentBaseMap = L.tileLayer.provider('Stamen.Toner');
        //Set basemap
        leaflet.baseLayers = {
            'Stamen Toner Map': $scope.currentBaseMap,
            //            'Street Map': Esri_WorldStreetMap,
            'Open StreetMap': OpenStreetMap,
            'Detailed Streets': OpenMapSurfer_Roads,
            'MapQuest': MapQuestOpen_OSM,
            'Aerial': MapQuestOpen_Aerial

        };


        leaflet.overlays = {
            'High Opportunity Areas': $scope.HOAs,
            'Priority Development Areas': $scope.PDAs,
            'Transit Priority Areas': $scope.TPAs,
            'Communities of Concern': $scope.COCs
        };



        //Add map to map-view div
        $scope.map = L.map('map-view', {
            zoomControl: true,
            attributionControl: false,
            layers: [$scope.currentBaseMap]
        });
        L.control.layers(leaflet.baseLayers, leaflet.overlays).addTo($scope.map);

        //Set map defaults
        $scope.map.defaults = {
            icon: new L.Icon({
                iconUrl: '../assets/images/rtp-map-marker.png',
                iconSize: [24, 24],
                iconAnchor: [12, 12] //,
                    //                shadowUrl: 'dot_shadow.png',
                    //                shadowSize: [16, 16],
                    //                shadowAnchor: [8, 8]
            }),
            color: '#2196F3',
            weight: 15,
            opacity: 0.95,
            fillColor: '#ffffff',
            fillOpacity: 0.75
        };

        // On map load, run  mapFeature which will zoom to feature if project is mapped
        $scope.map.loaded = false;
        $scope.map.on('load', function () {
            if (!$scope.map.loaded) {
                $scope.map.loaded = true;
                $scope.mapFeature(true, true);
            }
        });

        // Set map initial view
        $scope.map.setView([37.78, -122.42], 9);
        //Create Map Tools

        $scope.options = {
            position: 'topleft',
            draw: {
                polyline: {
                    allowIntersection: false,
                    drawError: {
                        color: '#EEA032',
                        timeout: 1000
                    },
                    shapeOptions: {
                        stroke: true,
                        color: '#EEA032',
                        weight: 15,
                        opacity: 0.95,
                        clickable: true
                    }
                },
                marker: {
                    icon: L.icon({
                        iconUrl: '../assets/images/rtp-map-marker.png',
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                    })
                },
                polygon: {

                    allowIntersection: false,
                    showArea: false,
                    drawError: {
                        color: '#EEA032',
                        timeout: 1000
                    },
                    shapeOptions: {
                        color: '#EEA032',
                        weight: 15,
                        opacity: 0.95,
                        fillColor: '#ffffff',
                        fillOpacity: 0.75,
                    }
                },
                circle: false, // Turns off this drawing tool
                rectangle: false
            },
            edit: {
                featureGroup: $scope.editFeatureGroup, //REQUIRED!!
                remove: true
            }
        };

        $scope.drawControl = new L.Control.Draw($scope.options);


        //DRAW Tools
        // Set the button title text for the polyline button
        L.drawLocal.draw.toolbar.buttons.polyline = 'Draw a line at Project Location';
        L.drawLocal.draw.toolbar.buttons.marker = 'Place Marker at Project Location';

        var resetMapViewBTN = L.easyButton('fa-home', function () {
            $scope.map.setView([37.78, -122.42], 9);
        });
        //Fullscreen Button
        var maximizeBTN = L.easyButton({
            states: [{
                stateName: 'expand-map',
                icon: 'fa-caret-square-o-up',
                title: 'Expand the Map View to Full Screen',
                onClick: function (control) {
                    $('#map-view').fadeOut(100, function () {
                        $('#project-details').fadeOut(0, function () {
                            $('#map-view').removeClass('col-md-6');
                            $('#map-view').addClass('col-md-12');
                            $('#map-view').fadeIn();
                        });


                        $scope.map._onResize();
                    });
                    control.state('minimize-map');
                }
                    }, {
                stateName: 'minimize-map',
                icon: 'fa-caret-square-o-down',
                title: 'Click to exit the Full Screen Map View.',
                onClick: function (control) {

                    $('#map-view').fadeOut(100, function () {
                        $('#map-view').removeClass('col-md-12');
                        $('#map-view').addClass('col-md-6');
                        $('#map-view').fadeIn();
                        $('#project-details').fadeIn();
                        $scope.map._onResize();
                    });
                    control.state('expand-map');

                }
                    }]
        });
        //Search Control Tool        


        //Route Button
        var RteBTN = L.easyButton({
            states: [{
                stateName: 'create-route',
                icon: 'fa-road',
                title: 'Create Route for Project Location',
                onClick: function (control) {
                    console.clear();
                    console.log("You Clicked the Route Button!");
                    //Add function here to create markers on map.
                    control.state('add-markers');
                }
                    }, {
                stateName: 'add-markers',
                icon: 'fa-code-fork',
                title: 'Click to draw route.',
                onClick: function (control) {
                    console.clear();
                    console.log("You Clicked the Draw Route Button!");
                    //add function here to create route using route markers created in previous state.
                    control.state('create-route');
                    //On successful run of the route solver, enable the saveBTN.
                    //saveBTN.enable();
                }
                    }]
        });

        //Edit Button
        var editBTN = L.easyButton({
            states: [{
                stateName: 'Start-Edits',
                icon: 'fa-magic',
                title: 'Start Editing',
                onClick: function (control) {
                    console.clear();
                    console.log("You Clicked the Start Edit Button!");
                    //Add function here to start editing
                    control.state('Stop-Edits');
                    $scope.editMapMode = true;
                    $scope.MapViewRefresh();

                }
                    }, {
                stateName: 'Stop-Edits',
                icon: 'fa-stop',
                title: 'Stop Editing',
                onClick: function (control) {
                    console.clear();
                    console.log("You Clicked the Stop Edits Button!");
                    //add function here to create route using route markers created in previous state.
                    control.state('Start-Edits');
                    //After User clicks the stop editing button, check to ensure edits are saved.  Use a prompt window to confirm saving changes...
                    //This will remove all editing tools from the map interface.
                    $scope.removeTools();
                    $scope.editMapMode = false;
                    $scope.MapViewRefresh();


                }
                    }]
        });

        //Project Save Button and Function
        var saveBTN = L.easyButton('fa-save', function () {
            console.clear();
            console.log("You Saved the project!");
            //check for existing feature vs new feature should point to add or update function
            if ($scope.isMapped) {
                $scope.updateProject();
            } else {
                $scope.addProject();
            }

        });

        //Add Map Tools on Load
        $scope.searchControl = L.esri.Geocoding.Controls.geosearch();
        $scope.searchControl.on('results', function (data) {
            $scope.searchresults.addTo($scope.map);
            //console.clear();
            //console.log(data.results[0]);
            $scope.searchresults.clearLayers();
            $scope.searchresults.addLayer(L.marker(data.results[0].latlng));

        });
        maximizeBTN.addTo($scope.map);
        $scope.searchControl.addTo($scope.map);
        //resetMapViewBTN.addTo($scope.map);
        editBTN.addTo($scope.map);
        //kearey has disabled this feature for the time being.    
        editBTN.disable();

        //change to updateProject
        $scope.updateProject = function () {
            projects.updateMapFeature($scope.projectid, $scope.newFeature).success(function (response) {
                $scope.mapFeature();
                if ($scope.searchresults._map) {
                    $scope.searchresults.clearLayers();
                }
                $scope.clearMap();
                $scope.removeTools();
                $scope.MapViewRefresh();
                $scope.refresh();
            }).error(function (error) {
                console.log(error);
            });
        }

        //add function to insert new projects after they have been mapped
        $scope.addProject = function () {
            projects.addMapFeature($scope.projectid, $scope.newFeature).success(function (response) {
                $scope.mapFeature();
                if ($scope.searchresults._map) {
                    $scope.searchresults.clearLayers();
                }
                $scope.clearMap();
                $scope.removeTools();
                $scope.MapViewRefresh();
                $scope.refresh();
            }).error(function (error) {
                console.log(error);
            });
        }
        $scope.updateMapStatus = function () {
            //console.log($scope.projectid);
            var statusUpdate = {
                Mapping_Status: $scope.mapDetails[0].Mapping_Status
            };
            status.updateMapStatus($scope.projectid, statusUpdate).success(function (response) {
                //Define notification
                var icon = 'fa fa-pencil fa-2x';
                var message = 'New status is: ' + $scope.mapDetails[0].Mapping_Status;
                var title = 'Mapping Status Updated';
                var type = 'success';
                //Add notification
                notify(icon, title, message, type);
                //refresh project view. Defined in viewprojects.controller.js
                $scope.refresh();

            }).error(function (error) {
                console.log(error);
            });
        };

        //Update tool type and show bootstrap notification
        $scope.updateToolType = function () {
            //console.log($scope.projectid);
            var tooltypeUpdate = {
                Tool_Type: $scope.mapDetails[0].Tool_Type
            };
            projects.updateToolType($scope.projectid, tooltypeUpdate).success(function (response) {
                //Update project grid view
                $scope.Tool_Type = $scope.mapDetails[0].Tool_Type;
                $scope.refresh();
                $scope.removeTools();
                $scope.MapViewRefresh();

                //Define notification
                icon = 'glyphicon glyphicon-warning-sign';
                message = 'New Tool Type is: ' + $scope.mapDetails[0].Tool_Type;
                title = 'Tool Type Updated';
                type = 'success';
                //Add notification
                notify(icon, title, message, type);



            }).error(function (error) {
                console.log(error);
                console.log(error);
                icon = 'glyphicon glyphicon-warning-sign';
                title = 'Oops! System Error';
                message = 'Error Message: ' + error;
                type = 'danger';

                notify(icon, title, message, type);
            });
        };

        //Clear Map Editing Tools
        $scope.removeTools = function () {
                console.clear();
                //maximizeBTN.removeFrom($scope.map);

                if ($scope.drawControl._map) {
                    $scope.drawControl.removeFrom($scope.map);
                    console.clear();
                    console.log('removed drawing control');
                }

                saveBTN.removeFrom($scope.map);

                switch ($scope.RouteTool) {
                case true:
                    //RteBTN.removeFrom($scope.map);
                    break;
                }

            }
            //Zoom to map feature if project is mapped

        //Add map to page
        //$scope.addMap();
        //Run this function after page has loaded.
        $scope.MapViewRefresh();

        // Helper functions

        // Convert Leaflet layer to WKT
        function toWKT(layer, multitype) {
            var lng, lat, coords = [];
            console.clear();
            // console.log(layer);
            if (multitype === 'point') {
                console.log('instance of multipoint');
                return "POINT(" + layer.getLatLng().lng + " " + layer.getLatLng().lat + ")";
            }

            if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
                var latlngs = layer.getLatLngs();
                for (var i = 0; i < latlngs.length; i++) {
                    latlngs[i];
                    coords.push(latlngs[i].lng + " " + latlngs[i].lat);
                    if (i === 0) {
                        lng = latlngs[i].lng;
                        lat = latlngs[i].lat;
                    }
                }

                if (multitype === 'line') {
                    console.log('instance of multiline');
                    return 'MULTILINESTRING(' + coords.join(',') + ')';
                }

                if (layer instanceof L.Polygon) {
                    return 'POLYGON((' + coords.join(',') + ',' + lng + ' ' + lat + '))';
                } else if (layer instanceof L.Polyline) {
                    return 'LINESTRING(' + coords.join(',') + ')';
                }
            } else if (layer instanceof L.Marker) {
                console.log('instance of marker');
                return "POINT(" + layer.getLatLng().lng + " " + layer.getLatLng().lat + ")";
            }


        }

        //Reads WKT and returns leaflet layer
        function returnWKTFeature(layer) {
            //console.log(layer);
            if (layer) {
                wkt = new Wkt.Wkt();
                try { // Catch any malformed WKT strings
                    wkt.read(layer);

                } catch (e1) {
                    try {
                        wkt.read(el.value.replace('\n', '').replace('\r', '').replace('\t', ''));

                    } catch (e2) {
                        if (e2.name === 'WKTError') {
                            alert('Wicket could not understand the WKT string you entered. Check that you have parentheses balanced, and try removing tabs and newline characters.');
                            return;
                        }
                    }
                }
                obj = wkt.toObject($scope.map.defaults); // Make an object
                // Add listeners for overlay editing events
                if (wkt.type === 'polygon' || wkt.type === 'linestring') {}

                return obj;
            }

        }

        //Notification
        function notify(icon, title, message, type) {
            $.notify({
                // options
                icon: icon,
                title: title,
                message: message,
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

        //        function multiGeometrySample() {
        //            // Generating Mult Point and Multi String
        //            // Sample Multipoint markers
        //            var marker1 = L.marker([50.505, 30.57]);
        //            var marker2 = L.marker([50.505, 30.67]);
        //
        //            //Sample polylines
        //            var polylinePoints = [
        //                new L.LatLng(37.7880233810327, -122.40297822242036),
        //                new L.LatLng(37.788001999556684, -122.40300600012563)
        //            ];
        //
        //            var polylinePoints2 = [
        //                new L.LatLng(37.787936999632848, -122.40370199953645),
        //                new L.LatLng(37.7877120001649, -122.40546499987533)
        //            ];
        //
        //            //Sample Multilinestring
        //            var polyline1 = new L.Polyline(polylinePoints);
        //            var polyline2 = new L.Polyline(polylinePoints2);
        //
        //            //Create feature groups
        //            var layerGroupLine = L.featureGroup([polyline1, polyline2]);
        //            var layerGroupPoint = L.featureGroup([marker1, marker2]);
        //
        //            var teststringLine = 'MULTILINESTRING (';
        //            var teststringPoint = 'MULTIPOINT (';
        //            layerGroupLine.eachLayer(function (layer) {
        //                var coords = toWKT(layer, 'line');
        //                teststringLine = teststringLine + coords + ",";
        //
        //            });
        //
        //            layerGroupPoint.eachLayer(function (layer) {
        //                var coords = toWKT(layer, 'point');
        //                teststringPoint = teststringPoint + coords + ",";
        //
        //            });
        //
        //            //Remove the trailing comma and add final parentheses
        //            teststringLine = teststringLine.slice(0, -1);
        //            teststringLine = teststringLine + ")";
        //
        //            teststringPoint = teststringPoint.slice(0, -1);
        //            teststringPoint = teststringPoint + ")";
        //            //console.log(teststringLine);
        //            //console.log(teststringPoint);
        //
        //            //End Generating Multi Point and Multi String
        //        }

        //Map Navigation Tools
        $("#pnorth").on("click", function () {
            $scope.map.panBy([0, -80]);
        });
        $("#psouth").on("click", function () {
            $scope.map.panBy([0, 80]);
        });
        $("#peast").on("click", function () {
            $scope.map.panBy([80, 0]);
        });
        $("#pwest").on("click", function () {
            $scope.map.panBy([-80, 0]);
        });

    });