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
	// var ipaddr = '3.110.207.245'//change to .env entry later
	var ipaddr = 'localhost'
	const url='http://'+ipaddr+':5566/getroute?lat1='+ lat1 +'&lon1='+lng1+'&lat2='+lat2+'&lon2='+lng2;
	console.log(url)
	Http.open("GET", url);
	Http.setRequestHeader('Access-Control-Allow-Origin', 'http://3.110.207.245:5566')
	Http.send();
	
	Http.onreadystatechange = (e) => {
	  console.log(Http.responseText)
	  var result = Http.responseText
	  const nestedList = JSON.parse(result.replace(/'/g, '"'))
	  var polyline = L.polyline(nestedList, {color: 'red'}).addTo(map)
	  // zoom the map to the polyline
	  map.fitBounds(polyline.getBounds());
	}
}