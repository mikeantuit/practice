app.factory('MarkerCreatorService', function () {

    var markerId = 0;

    function create(latitude, longitude) {
        var marker = {
            options: {
                animation: 1,
                labelAnchor: "28 -5",
                labelClass: 'markerlabel'    
            },
            latitude: latitude,
            longitude: longitude,
            id: ++markerId          
        };
        return marker;        
    }

    function invokeSuccessCallback(successCallback, marker) {
        if (typeof successCallback === 'function') {
            successCallback(marker);
        }
    }

    function createByCoords(latitude, longitude, successCallback) {
        var marker = create(latitude, longitude);
        invokeSuccessCallback(successCallback, marker);
    }

    function createByAddress(address, successCallback) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address' : address}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                var firstAddress = results[0];
                var latitude = firstAddress.geometry.location.lat();
                var longitude = firstAddress.geometry.location.lng();
                var marker = create(latitude, longitude);
                invokeSuccessCallback(successCallback, marker);
            } else {
                alert("Unknown address: " + address);
            }
        });
    }

    function createByCurrentLocation(successCallback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var marker = create(position.coords.latitude, position.coords.longitude);
                invokeSuccessCallback(successCallback, marker);
            });
        } else {
            alert('Unable to locate current position');
        }
    }

    return {
        createByCoords: createByCoords,
        createByAddress: createByAddress,
        createByCurrentLocation: createByCurrentLocation
    };

});

app.controller('MapCtrl', ['MarkerCreatorService', '$scope', function (MarkerCreatorService, $scope) {

        MarkerCreatorService.createByCoords(40.2992017, -74.6077627, function (marker) {
            marker.options.labelContent = 'Princeton Junction';
            $scope.autentiaMarker = marker;
        });
        
        $scope.address = '';

        $scope.map = {
            center: {
                latitude: $scope.autentiaMarker.latitude,
                longitude: $scope.autentiaMarker.longitude
            },
            zoom: 12,
            markers: [],
            control: {},
            options: {
                scrollwheel: false
            }
        };

        $scope.map.markers.push($scope.autentiaMarker);

        $scope.addCurrentLocation = function () {
            MarkerCreatorService.createByCurrentLocation(function (marker) {
                marker.options.labelContent = 'You are here';
                $scope.map.markers.push(marker);
                refresh(marker);
            });
        };
        
        $scope.addAddress = function() {
            var address = $scope.address;
            if (address !== '') {
                MarkerCreatorService.createByAddress(address, function(marker) {
                    $scope.map.markers.push(marker);
                    refresh(marker);
                });
            }
        };

        function refresh(marker) {
            $scope.map.control.refresh({latitude: marker.latitude,
                longitude: marker.longitude});
        };


        $(document).ready(function(){
            $("form").submit(function(){
                $.get($(this).attr("action") + "?callback=?",
                      $(this).serialize(),
                      function(dojo){
                        console.log(dojo)
                        var temp_f = dojo.data.current_condition[0].temp_F,
                            temp_c = dojo.data.current_condition[0].temp_C,
                            windSpeed = dojo.data.current_condition[0].windspeedMiles,
                            weather = dojo.data.current_condition[0].weatherDesc[0].value;

                        $("#forecast").html("<div>The current temperature F: " + temp_f +
                                             "</div><div>The current temperature C: " + temp_c +
                                             "</div><div>The current windspeed: " + windSpeed + 
                                             "mph</div><div>Weather Description: " + weather + "</div>");
                      }, "json");

                return false;
            });
        });
        
        var directionsDisplay = new google.maps.DirectionsRenderer({ draggable: true });
        var directionsService = new google.maps.DirectionsService();
        var map;

        // $(window).load(function() {
            var myOptions = {
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: new google.maps.LatLng(37.2969326,-121.9578394)
            };
            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
            directionsDisplay.setMap(map);
            directionsDisplay.setPanel(document.getElementById("directions"));
            
            $("#routeMode").on("change", function() { calcRoute(); });
            $("#routeGo").on("click", function() { calcRoute(); });
            $("#routeClear").on("click", function() { directionsDisplay.setDirections({ routes: [] }); });
            
        // });


        function calcRoute() {
            var request = {
                origin: $("#routeTo").val(),
                destination: $("#routeFrom").val(),
                travelMode: google.maps.TravelMode[$("#routeMode").val()]
            };
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });
        }

    }]);