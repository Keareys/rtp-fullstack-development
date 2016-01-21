'use strict';

angular.module('testApp')
    .controller('BundlesCtrl', function($scope, performance, Modal, $state, $location, $window, $http) {
        //Add global variables
        $scope.projectIds = [];
        $scope.testIds;

        $scope.map;

        // Map Variables
        var config, el, obj, wkt, leaflet, that, tpas;

        //Add modals
        $scope.showBundleProjectsModal = Modal.confirm.bundledProjects(function(events) { // callback when modal is confirmed
            console.log(events);
        });

        //initialize map
        $scope.initializeMap = function() {
            $scope.map = L.map('map-div').setView([37.75, -122.23], 10);
            //Base maps
            var topo = L.esri.basemapLayer('Topographic');
            var streets = L.esri.basemapLayer('Streets');
            var toner = L.tileLayer.provider('Stamen.Toner');

            //Overlays
            var tpas = L.esri.featureLayer({
                url: 'http://gis.mtc.ca.gov/mtc/rest/services/RTP/RTP_PolicyLayers/FeatureServer/0',
                simplifyFactor: 0.8,
                precision: 5,
                style: function(feature) {
                    return {
                        color: 'red',
                        weight: 2
                    };
                }
            });


            var pdas = L.esri.featureLayer({
                url: 'http://gis.mtc.ca.gov/mtc/rest/services/RTP/RTP_PolicyLayers/FeatureServer/1',
                simplifyFactor: 0.8,
                precision: 5,
                style: function(feature) {
                    return {
                        color: 'green',
                        weight: 2
                    };
                }
            });

            var cocs = L.esri.featureLayer({
                url: 'http://gis.mtc.ca.gov/mtc/rest/services/RTP/RTP_PolicyLayers/FeatureServer/3',
                simplifyFactor: 0.8,
                precision: 5,
                style: function(feature) {
                    return {
                        color: 'purple',
                        weight: 2
                    };
                }
            });

            var hoas = L.esri.featureLayer({
                url: 'http://gis.mtc.ca.gov/mtc/rest/services/RTP/RTP_PolicyLayers/FeatureServer/2',
                simplifyFactor: 0.8,
                precision: 5,
                style: function(feature) {
                    return {
                        color: 'orange',
                        weight: 2
                    };
                }
            });

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
                fillColor: '#2196F3',
                fillOpacity: 0.8
            };

            var baseMaps = {
                "Topographic": topo,
                "Streets": streets,
                "Stamen Toner": toner
            };

            var overLays = {
                "PDAs": pdas,
                "COCs": cocs,
                "TPAs": tpas,
                "HOAs": hoas

            };

            toner.addTo($scope.map);
            console.log($scope.projectIds);

            L.control.layers(baseMaps, overLays).addTo($scope.map);
            //Add map layers
            $scope.featureGroup = L.featureGroup();
            console.log($scope.featureGroup.getLayers().length);
            if ($scope.featureGroup.getLayers().length > 0) {
                $scope.featureGroup.clearLayers();
            }
            $scope.featureGroup.addTo($scope.map);
            // getFeatures($scope.projectIds);
        };



        //Loads bundle names and ids in grid
        $scope.refresh = function() {
            performance.getPerformance().success(function(response) {
                $scope.names = response;
            }).error(function(error) {
                console.log(error);
            });

            $scope.projectIds = [];
        };

        $scope.refresh();

        //Gets the individual projects in a bundle and loads bundles view
        $scope.showBundleProjects = function(id) {
            $state.go('bundles.view');
            //set global bundle id
            performance.getBundledProjects(id).success(function(response) {
                //  console.log(response);
                $scope.projectList = response;
                for (var i = response.length - 1; i >= 0; i--) {
                    $scope.projectIds[i] = {
                        'Project_ID': response[i].Project_ID
                    };
                }
                $scope.testIds = $scope.projectIds;
                getFeatures($scope.projectIds);

                $scope.initializeMap();
                // $scope.showBundleProjectsModal(projectList);
            }).error(function(error) {
                console.log(error);
            });

        };

        //Realoads main bundle page when on map page
        $scope.reloadMainList = function() {
            $state.go('bundles');
            $scope.refresh();
            $scope.projectIds = [];
        };

        //Creates a query string from bundle projects and loads view projects page
        $scope.showProjects = function() {
            var id = $scope.testIds;
            var urlParam = '';
            var mainString = '';
            var startString = '';
            var counter = 0;

            if (id.length === 1) {
                urlParam = "id0" + "=" + id[0].Project_ID;
                counter = counter;
            } else if (id.length === 2) {
                urlParam = 'id0=' + id[0].Project_ID + '&id1=' + id[1].Project_ID;
                counter = 1;
            } else if (id.length > 2) {

                for (var i = 0; i < id.length; i++) {
                    console.log(id[i].Project_ID);
                    console.log(i);
                    if (i === 0) {
                        startString = "id" + i + "=" + id[0].Project_ID;
                    } else if (i > 0) {
                        mainString = mainString + "&id" + i + "=" + id[i].Project_ID;
                    }
                    counter = counter + 1;
                }
                urlParam = startString + mainString;
                console.log(urlParam);

            }
            $window.location.href = '/viewprojects?counter=' + counter + "&" + urlParam;
        };



        //Loads all the features for a bundle into a featureGroup
        function getFeatures(ids) {
            // console.log(ids);
            performance.getBundledProjectFeatures(ids).success(function(response) {
                // console.log(response);
                //Convert all returned features to leaflet layer and add to feature group
                for (var i = response.length - 1; i >= 0; i--) {
                    if (response[i].WKT_WGS84) {
                        $scope.setBounds = true;
                        $scope.featureGroup.addLayer(returnWKTFeature(response[i].WKT_WGS84));
                    }
                }
                if (response.length > 0) {
                    $scope.map.fitBounds($scope.featureGroup.getBounds());
                }
                $scope.projectIds = [];
            }).error(function(error) {
                console.log(error);
            });
        }

        //Reads WKT and returns leaflet layer
        function returnWKTFeature(layer) {

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


    });
