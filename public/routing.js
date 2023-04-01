var map = L.map('map').setView([12.887802, 77.6432018], 13);
L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
	maxZoom: 20,
	subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

var lat1,lng1,lat2,lng2
map.on('click', function(e) {
	L.marker(e.latlng).addTo(map)
	if(typeof(lat1)=="undefined") {
		lat1 = e.latlng.lat
		lng1 = e.latlng.lng
		console.log(lat1,lng1);
	}
	else {
		lat2 = e.latlng.lat
		lng2 = e.latlng.lng
		console.log("Point 2" ,lat2,lng2);
	}
});