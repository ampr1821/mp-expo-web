// var map = L.map('map').setView([12.887802, 77.6432018], 13);
var routingControl;
var socket = io();

// L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
// 	maxZoom: 20,
// 	subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
// }).addTo(map);

var map = L.map("map").setView([12.887802, 77.6432018], 18);

L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
  maxZoom: 51,
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
}).addTo(map);

var lat1, lng1, lat2, lng2;
var nestedList = [];
var markersLayer = L.layerGroup();
routingControl = L.Routing.control({
  waypoints: nestedList,
  show: false,
  waypointMode: "connect",
  createMarker: function () {},
}).addTo(map);

map.on("click", function (e) {
  if (lat1 == null) {
    lat1 = e.latlng.lat;
    lng1 = e.latlng.lng;
    marker = L.marker(e.latlng);
    markersLayer.addTo(map);
    markersLayer.addLayer(marker);
    console.log(lat1, lng1);
  } else if (lat2 == null) {
    lat2 = e.latlng.lat;
    lng2 = e.latlng.lng;
    marker = L.marker(e.latlng);
    markersLayer.addTo(map);
    markersLayer.addLayer(marker);
    console.log("Point 2", lat2, lng2);
  }
});

function removeMarkers() {
  // map.removeControl(control);
  if (routingControl != undefined) {
    console.log("clearing route!");
    routingControl.setWaypoints([]);
    // routingControl.remove();
  }
  map.removeLayer(markersLayer);
  markersLayer = L.layerGroup();
  lat1 = null;
  lng1 = null;
  lat2 = null;
  lng2 = null;
}

function myFunction() {
	socket.emit('get route', [lat1, lng1, lat2, lng2]);
	// const Http = new XMLHttpRequest();
	// // var ipaddr = '3.110.207.245'//change to .env entry later
	// var ipaddr = 'localhost'
	// const url = 'http://' + ipaddr + ':5566/getroute?lat1=' + lat1 + '&lon1=' + lng1 + '&lat2=' + lat2 + '&lon2=' + lng2;
	// console.log(url)
	// Http.open("GET", url);
	// Http.setRequestHeader('Access-Control-Allow-Origin', 'http://3.110.207.245:5566')
	// Http.send();

	// Http.onreadystatechange = (e) => {
	// 	console.log(Http.responseText)
	// 	var result = Http.responseText
	// 	nestedList = JSON.parse(result.replace(/'/g, '"'))
	// 	routingControl.setWaypoints(nestedList);
	// 	//   var polyline = L.polyline(nestedList, {color: 'red'}).addTo(map)
	// 	// zoom the map to the polyline
	// 	// map.fitBounds(polyline.getBounds());
	// }
}

socket.on('route', (data) => {
	nestedList = data;
	routingControl.setWaypoints(nestedList);
	console.log('route displayed')
});
