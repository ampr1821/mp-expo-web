// var map = L.map('map').setView([12.887802, 77.6432018], 13);
var routingControl;
var socket = io();
var ipaddr = '';

socket.emit('get ip');

socket.on('ip', (ip) => {
  ipaddr = ip;
  console.log('API Host is ' + ip);
});

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
  createMarker: function () { },
}).addTo(map);

map.on("click", function (e) {
  if (lat1 == null) {
    lat1 = e.latlng.lat;
    lng1 = e.latlng.lng;
    marker = L.marker(e.latlng);
    what3words.api.convertTo3wa({lat:e.latlng.lat, lng:e.latlng.lng}, 'en')
    .then(function(response) {
      console.log("[convertTo3wa]", response);

      northeast = [response.square.northeast.lat,response.square.northeast.lng] 
      southwest = [response.square.southwest.lat,response.square.southwest.lng]

      result = getOtherCorners(northeast,southwest)

    southeast = result.southeast.split(",").map(Number);
    northwest = result.northwest.split(",").map(Number);


    var pointA = new L.LatLng(northwest[0], northwest[1]);
    var pointB = new L.LatLng(northeast[0],northeast[1]);
    var pointC = new L.LatLng(southeast[0], southeast[1]);
    var pointD = new L.LatLng(southwest[0],southwest[1]);
    

    var pointList = [pointA,pointB,pointC,pointD,pointA];

    var firstpolyline = new L.Polyline(pointList, {
        color: 'red',
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
    });
firstpolyline.addTo(map);


    });
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
  const Http = new XMLHttpRequest();
  // var ipaddr = '3.110.207.245'//change to .env entry later
  // var ipaddr = 'localhost'
  const url = 'http://' + ipaddr + ':5566/getroute?lat1=' + lat1 + '&lon1=' + lng1 + '&lat2=' + lat2 + '&lon2=' + lng2;
  console.log(url)
  Http.open("GET", url);
  Http.setRequestHeader('Access-Control-Allow-Origin', 'http://3.110.207.245:5566')
  Http.send();

  Http.onreadystatechange = (e) => {
    console.log(Http.responseText)
    var result = Http.responseText
    nestedList = JSON.parse(result.replace(/'/g, '"'))
    routingControl.setWaypoints(nestedList);
    //   var polyline = L.polyline(nestedList, {color: 'red'}).addTo(map)
    // zoom the map to the polyline
    // map.fitBounds(polyline.getBounds());
  }
}


function getOtherCorners(northeast, southwest) {

    // Calculate the coordinates of the southeast corner
    const southeast = [southwest[0], northeast[1]];

    
    // Calculate the coordinates of the northwest corner
    const northwest = [northeast[0], southwest[1]];
 
    
    console.log(southeast+"---"+northwest)
    // Return the coordinates of the other two corners
    return {
      southeast: southeast.join(","),
      northwest: northwest.join(",")
    };


  }
  

  

socket.on('route', (data) => {
  nestedList = data;
  routingControl.setWaypoints(nestedList);
  console.log('route displayed')
});
