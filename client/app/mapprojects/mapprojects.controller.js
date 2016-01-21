'use strict';

angular.module('testApp')
    .controller('MapprojectsCtrl', function($rootScope, $scope, $http, mapping) {
        $scope.message = 'Hello';
        $scope.lrs = {};

        var features = [];
        var config, el, obj, wkt, leaflet, that;

        leaflet = {
            baseLayers: undefined,
            overlays: undefined
        };

        leaflet.baseLayers = {
            'Stamen Toner Map': L.tileLayer.provider('Stamen.Toner')
        };

        leaflet.map = L.map('map', {
            zoomControl: true,
            attributionControl: true,
            layers: [
                leaflet.baseLayers['Stamen Toner Map'],
            ]
        });

        leaflet.map.defaults = {
            icon: new L.Icon({
                iconUrl: 'red_dot.png',
                iconSize: [16, 16],
                iconAnchor: [8, 8],
                shadowUrl: 'dot_shadow.png',
                shadowSize: [16, 16],
                shadowAnchor: [8, 8]
            }),
            editable: true,
            color: '#AA0000',
            weight: 15,
            opacity: 0.6,
            fillColor: '#AA0000',
            fillOpacity: 0.2
        };

        leaflet.map.loaded = false;
        leaflet.map.on('load', function() {
            if (!leaflet.map.loaded) {
                leaflet.map.loaded = true;
                //document.getElementById('wkt').value = 'LINESTRING (-122.39177501630519 37.75260413156667, -122.38680756544761 37.752909515134547, -122.3865286151958 37.750322202189295)';
            }
        });


        leaflet.map.setView([37.78, -122.42], 12);
        //GEOPROCESSING
        //Add Geoprocessing tools
        var gpService_XY = L.esri.GP.Services.geoprocessing({
            url: "http://gis.mtc.ca.gov/mtc/rest/services/AADT/LocateBayAreaLRSXY/GPServer/LocateBayAreaLRS_XY",
            useCors: false
        });

        var gpService_LRS = L.esri.GP.Services.geoprocessing({
            url: "http://gis.mtc.ca.gov/mtc/rest/services/AADT/LocateBayAreaLRS/GPServer/LocateBayAreaLRS",
            useCors: false
        });

        var gpTask_XY = gpService_XY.createTask();
        var gpTask_LRS = gpService_LRS.createTask();

        //Add highlight color for located route
        var highlightStyle = {
            color: '#AA0000',
            weight: 15,
            opacity: 0.6,
            fillColor: '#AA0000',
            fillOpacity: 0.2
        };

        //Add feature groups for clicked points and located route
        var lrsFeatures = L.featureGroup();
        var lrsPoints = L.featureGroup();
        leaflet.map.addLayer(lrsFeatures);

        leaflet.map.on('click', function(evt) {
            console.log(evt.latlng);
            lrsFeatures.clearLayers();
            var xy = {
                Lat: evt.latlng.lat,
                Long: evt.latlng.lng
            };
            mapping.updateXY(xy).success(function(response) {
                L.marker([evt.latlng.lat, evt.latlng.lng]).addTo(leaflet.map);
                gpTask_XY.run(xy_callback);
            }).error(function(error) {
                console.log(error);
            });


            //  gpTask.setParam("Input_Location", evt.latlng)

        });

        //Add function to update LRS table and run GP LRS tool. 
        $scope.drawLRS = function() {
            console.log($scope.lrs);
            lrsPoints.clearLayers();
            lrsFeatures.clearLayers();
            mapping.updateLRS($scope.lrs).success(function(response) {
                console.log(response);
                gpTask_LRS.run(lrs_callback);
            }).error(function(error) {
                console.log(error);
            });
        };

        //Callback updates the scope.lrs variable
        function xy_callback(error, response, raw) {
            if (error) console.log(error);
            var result = response.Located_XY_Measure.features[0].attributes;
            if (!$scope.lrs.From_Measure) {
                console.log(response);
                $scope.lrs.RID = result.RID;
                $scope.lrs.From_Measure = result.MEAS;

            } else {
                console.log(response);
                $scope.lrs.To_Measure = result.MEAS;
            }
            // console.log($scope.lrs);

        }

        //Callback function adds created route to map
        function lrs_callback(error, response, raw) {
            if (error) console.log(error);

            // console.log($scope.lrs);
            lrsFeatures.addLayer(L.geoJson(response.gis_MZIYAMBI_Alameda_Segment_Counts_XY__3_, {
                style: highlightStyle
            }));
        }

        //END GEOPROCESSING


        //* Clears the map contents.        
        function clearMap() {
            var i;

            document.getElementById('wkt').last = '';

            for (i in features) {
                if (features.hasOwnProperty(i)) {
                    leaflet.map.removeLayer(features[i]);
                }
            }
            features.length = 0;

        }

        function mapIt(editable, focus) {
            clearMap();
            //var config, el, obj, wkt;
            // Indicates that the map should pan and/or zoom to new features
            focus = focus || false;

            if (editable === undefined) {
                editable = true;
            }

            //The container that has the value to map
            el = document.getElementById('wkt');
            wkt = new Wkt.Wkt();

            if (el.last === el.value) { // Remember the last string
                return; // Do nothing if the WKT string hasn't changed
            } else {
                el.last = el.value;
            }

            try { // Catch any malformed WKT strings
                wkt.read(el.value);
                //console.log(el.value)
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

            config = leaflet.map.defaults;
            config.editable = editable;

            obj = wkt.toObject(leaflet.map.defaults); // Make an object
            // Add listeners for overlay editing events
            if (wkt.type === 'polygon' || wkt.type === 'linestring') {}

            if (Wkt.isArray(obj)) { // Distinguish multigeometries (Arrays) from objects
                for (i in obj) {
                    if (obj.hasOwnProperty(i) && !Wkt.isArray(obj[i])) {
                        obj[i].addTo(leaflet.map);
                        features.push(obj[i]);
                        console.log(obj);
                    }
                }
            } else {
                obj.addTo(leaflet.map); // Add it to the map
                features.push(obj);
                console.log(obj);
            }

            // Pan the map to the feature
            if (focus && obj.getBounds !== undefined && typeof obj.getBounds === 'function') {
                // For objects that have defined bounds or a way to get them
                leaflet.map.fitBounds(obj.getBounds());
            } else {
                if (focus && obj.getLatLng !== undefined && typeof obj.getLatLng === 'function') {
                    leaflet.map.panTo(obj.getLatLng());
                }
            }

            return obj;
        }


        //App Listeners
        $('#MapItBTN').on('click', function() {
            mapIt(true, true);
        });


    });
