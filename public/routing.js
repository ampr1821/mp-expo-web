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

function myFunction() {
	const Http = new XMLHttpRequest();
	var ipaddr = '3.110.207.245'//change to .env entry later
	const url='http://'+ipaddr+':5566/getroute?lat1='+ lat1 +'&lon1='+lng1+'&lat2='+lat2+'&lon2='+lng2;
	Http.open("GET", url);
	Http.send();

	Http.onreadystatechange = (e) => {
	  console.log(Http.responseText)
	}
	var latlngs = [
	    [12.9092598,77.6395172],
		[12.9092659,77.6391683],
		[12.9092789,77.6384189],
		[12.9092848,77.6380325],
		[12.9097988,77.638043],
		[12.9097451,77.6416337],
		[12.9104182,77.6416628],
		[12.9114151,77.6417058],
		[12.9119965,77.6417201],
		[12.9122085,77.6417126],
		[12.9121971,77.64204],
		[12.912791,77.6420643],
		[12.9127933,77.6414959],
		[12.9140982,77.6415886],
	];

	var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);

	// zoom the map to the polyline
	map.fitBounds(polyline.getBounds());
}