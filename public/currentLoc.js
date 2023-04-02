
L.Control.geocoder().addTo(map);

if (!navigator.geolocation) {
    console.log("Your browser doesn't support geolocation feature!");
} else {
    navigator.geolocation.getCurrentPosition(getPosition);
    
    console.log(" geolocation works");
}

var marker, circle, lat, long, accuracy;

var StartPoint = L.icon({
    iconUrl: 'imgs/currLoc.png',
    iconSize: [50, 50]
})

function getPosition(position) {
    // console.log(position)
    lat = position.coords.latitude
    long = position.coords.longitude
    accuracy = position.coords.accuracy

    if (marker) {
        map.removeLayer(marker)
    }

    if (circle) {
        map.removeLayer(circle)
    }

    L.marker([lat, long], { icon: StartPoint}).addTo(map)
    L.circle([lat, long], { radius: 25}).addTo(map)
    // circle = L.circle([lat, long])

    // console.log(circle)

    

    // var featureGroup = L.featureGroup([marker, circle])
    

    // map.fitBounds(featureGroup.getBounds())    
    // map.flyTo([lat,long], 18)


    map.panTo([lat,long])


    console.log("Your coordinate is: Lat: " + lat + " Long: " + long + " Accuracy: " + accuracy)
}