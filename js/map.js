jQuery(function($) {

    var markers = [], map, directionsService, directionsDisplay, zoom = 14;
    var geocoder = new google.maps.Geocoder();
    var mapEl = $('#map-canvas');
    var center = new google.maps.LatLng(mapEl.data('lat'), mapEl.data('lng'));
    var mapStyles = [{"featureType": "administrative","elementType": "labels.text.fill","stylers": [{"color": "#444444"}]},{"featureType": "landscape","elementType": "all","stylers": [{"color": "#f2f2f2"}]},{"featureType": "poi","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "road","elementType": "all","stylers": [{"saturation": -100},{"lightness": 45}]},{"featureType": "road.highway","elementType": "all","stylers": [{"visibility": "simplified"}]},{"featureType": "road.arterial","elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "transit","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "water","elementType": "all","stylers": [{"color": "#46bcec"},{"visibility": "on"}]}];
    var infoWindow;
    var markerMain;
    var markerCustom;
    var place;

    var autoCompleteOptions = {
        types: ['(regions)']
        //componentRestrictions: {country: "ua"}
    };

    function addMarker(position, image, string, map, size){
            var marker = new google.maps.Marker({
                    'position': position,
                    icon: {
                        url: image,
                        scaledSize: size
                    },
                    'address': string
                });
            google.maps.event.addListener(marker, 'click', function(){
                showInfowindow(marker);
            });
            marker.setMap(map);
            return marker;
    }

    //show infowindow
    var showInfowindow = function(marker){
        infoWindow.setContent(marker.address);
        infoWindow.setPosition(marker.position);
        infoWindow.open();
    };
    
    function initialize() {
        var mapOptions = {
            zoom: zoom,
            scrollwheel: true,
            panControl: false,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            mapTypeControl: true,
            mapTypeControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            center: center,
            styles: mapStyles
        };
        
        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        infoWindow = new SnazzyInfoWindow({
            map: map,
            position: center,
            closeOnMapClick: false,
            offset: {
                top: '-30px',
                left: '0px'
            }
        });

        markerMain = addMarker(center, mapEl.data('image'), mapEl.data('string'), map, new google.maps.Size(30, 27));
        
        // var lineSymbol = {
        //   path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        //   strokeColor: '#fff',
        // strokeWeight: 3
        // };

        directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: "#3ea9d7",
              strokeWeight: 8,
              // icons: [{
              //       icon: lineSymbol,
              //       repeat: '5%'
              //   }],
            }
        });

        var input = document.getElementById('searchTextField');
        autocomplete = new google.maps.places.Autocomplete(input, autoCompleteOptions);

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            place = autocomplete.getPlace();
            calculateAndDisplayRoute(directionsService, directionsDisplay, place);
        });
        
    }


    function calculateAndDisplayRoute(directionsService, directionsDisplay, place, selectedMode) {
        if(!selectedMode) selectedMode = "DRIVING";
        $('.map-input-wrapper').addClass('active');
        $('.routes-select-entry.active').removeClass('active').find('.description').html('');
        infoWindow.close();
        if(markerCustom) markerCustom.setMap(null);
        markerCustom = addMarker(new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()), mapEl.data('image'), place.formatted_address, map, new google.maps.Size(30, 27));

        //fit map
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(markerCustom.getPosition());
        bounds.extend(markerMain.getPosition());
        map.fitBounds(bounds);

        directionsService.route({
            origin: markerMain.position,
            destination: place.geometry.location,
            travelMode: google.maps.TravelMode[selectedMode]
        }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                
                if(directionsDisplay) directionsDisplay.setMap(null);

                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);

                duration = secondsToString(response.routes[0].legs[0].duration.value);
                distance = response.routes[0].legs[0].distance.value/1000;
                text = 'Distance - '+distance+'km, Time - '+duration;
                
                $('.routes-select-entry[data-value="'+selectedMode+'"]').addClass('active').find('.description').html('('+text+')');
            } else {
                if(directionsDisplay) directionsDisplay.setMap(null);
                $('.routes-select-entry[data-value="'+selectedMode+'"]').addClass('active').find('.description').html('There are no available routes');
            }
        });
    }

    $('.routes-select-entry').on('click', function(){
        calculateAndDisplayRoute(directionsService, directionsDisplay, place, $(this).data('value'));
    });

    function secondsToString(seconds) {
        var numyears = Math.floor(seconds / 31536000);
        var numdays = Math.floor((seconds % 31536000) / 86400); 
        var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
        var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
        var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
        return ((numyears!==0)?(numyears + "y. "):'') + ((numdays!==0)?(numdays + "d. "):'') + ((numhours!==0)?(numhours + "h. "):'') + ((numminutes!==0)?(numminutes + "m."):'');
    }


    $('.clear-route').on('click', function(){
        if(markerCustom) markerCustom.setMap(null);
        if(directionsDisplay) directionsDisplay.setMap(null);
        $('.map-input-wrapper').removeClass('active');
        $('#searchTextField').val('');
        infoWindow.close();
        map.setCenter(center);
        map.setZoom(zoom);
    });

    initialize();

});