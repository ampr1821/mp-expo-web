// var map = L.map('map').setView([12.887802, 77.6432018], 13);
// var routingControl;
var socket = io();
var ipaddr = "";
let polylines = [];

socket.emit("get ip");
var user = false;

socket.on("ip", (ip) => {
  ipaddr = ip;
  console.log("API Host is " + ip);
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
let routingPolyline = L.polyline(nestedList, {color: 'red'});
var markersLayer = L.layerGroup();
// routingControl = L.Routing.control({
//   waypoints: nestedList,
//   show: false,
//   waypointMode: "connect",
//   serviceUrl: 'http://router.project-osrm.org/route/v1',
//   createMarker: function () { },
// }).addTo(map);

socket.on('route', (data) => {
  if (user == false) {

  }
  console.log("route displayed");
});

map.on("click", function (e) {
  if (lat1 == null) {
    lat1 = e.latlng.lat;
    lng1 = e.latlng.lng;
    marker = L.marker(e.latlng);
    w3w(e);
    markersLayer.addTo(map);
    markersLayer.addLayer(marker);
    console.log(lat1, lng1);
  }
  else if (lat2 == null) {
    lat2 = e.latlng.lat;
    lng2 = e.latlng.lng;
    marker = L.marker(e.latlng);
    w3w(e);
    markersLayer.addTo(map);
    markersLayer.addLayer(marker);
    console.log("Point 2", lat2, lng2);
  }
});

function removeMarkers() {
  // map.removeControl(control);
  // if (routingControl != undefined) {
  //   console.log("clearing route!");
  //   routingControl.setWaypoints([]);
  //   // routingControl.remove();
  // }
  polylines.forEach(element => {
    element.remove(map);
  });
  polylines = [];
  routingPolyline.remove(map);
  nestedList = [];
  map.removeLayer(markersLayer);
  markersLayer = L.layerGroup();
  lat1 = null;
  lng1 = null;
  lat2 = null;
  lng2 = null;
  user = false;
}

function myFunction() {
  const Http = new XMLHttpRequest();
  // var ipaddr = '3.110.207.245'//change to .env entry later
  // var ipaddr = 'localhost'
  const url =
    "http://" +
    ipaddr +
    ":5566/getroute?lat1=" +
    lat1 +
    "&lon1=" +
    lng1 +
    "&lat2=" +
    lat2 +
    "&lon2=" +
    lng2;
  console.log(url);
  Http.open("GET", url);
  Http.setRequestHeader(
    "Access-Control-Allow-Origin",
    "http://3.110.207.245:5566"
  );
  Http.send();

  Http.onreadystatechange = (e) => {
    console.log(Http.responseText);
    var result = Http.responseText;
    let nestedList = JSON.parse(result.replace(/'/g, '"'));
    user = true;
    socket.emit('broad', nestedList)
    // routingControl.setWaypoints(nestedList);
    routingPolyline.setLatLngs(nestedList);
    routingPolyline.addTo(map);
    // zoom the map to the polyline
    // map.fitBounds(polyline.getBounds());
  };
}

function getOtherCorners(northeast, southwest) {
  // Calculate the coordinates of the southeast corner
  const southeast = [southwest[0], northeast[1]];

  // Calculate the coordinates of the northwest corner
  const northwest = [northeast[0], southwest[1]];

  console.log(southeast + "---" + northwest);
  // Return the coordinates of the other two corners
  return {
    southeast: southeast.join(","),
    northwest: northwest.join(","),
  };
}

function w3w(e) {
  what3words.api.convertTo3wa({ lat: e.latlng.lat, lng: e.latlng.lng }, 'en')
    .then(function (response) {
      console.log("[convertTo3wa]", response);

      document.querySelector("#search-control input").setAttribute("placeholder", response.words)
      console.log(response.words)

      northeast = [response.square.northeast.lat, response.square.northeast.lng]
      southwest = [response.square.southwest.lat, response.square.southwest.lng]

      result = getOtherCorners(northeast, southwest)

      southeast = result.southeast.split(",").map(Number);
      northwest = result.northwest.split(",").map(Number);


      var pointA = new L.LatLng(northwest[0], northwest[1]);
      var pointB = new L.LatLng(northeast[0], northeast[1]);
      var pointC = new L.LatLng(southeast[0], southeast[1]);
      var pointD = new L.LatLng(southwest[0], southwest[1]);


      var pointList = [pointA, pointB, pointC, pointD, pointA];

      var firstpolyline = new L.Polyline(pointList, {
        color: 'red',
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
      });
      // firstpolyline.addTo(map);
      markersLayer.addLayer(firstpolyline);
    });
}

function trunc(num) {
  num = num + '';
  parts = num.split('.');
  parts[1] = parts[1].substring(0, 6);
  return parts[0] + '.' + parts[1];
}

async function display_traffic() {
  // const Http = new XMLHttpRequest();
  let bbox = map.getBounds();
  let bbox_url = trunc(bbox['_southWest']['lng']) + ',' + trunc(bbox['_southWest']['lat']) + ',' + trunc(bbox['_northEast']['lng']) + ',' + trunc(bbox['_northEast']['lat']);
  const url = 'https://data.traffic.hereapi.com/v7/flow?locationReferencing=shape&in=bbox:' + bbox_url + '&apiKey=tBP0FjQ6FQD01Mc3PcXPBSYvGaiRPcJmI3EwkPOzmAc';
  // Http.open("GET", url);
  console.log(url);
  let nestedList_ = [];
  fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(jsonResponse) {
    console.log('request complete')
    console.log(jsonResponse)
    try {
      let color = '';
      jsonResponse['results'].forEach(async element => {
        let list_ = element['location']['shape']['links'];
        let jam = element['currentFlow']['speed'] / element['currentFlow']['freeFlow'];
        if(jam <= 0.60) {
          color = '#ff6b6b'; // red
        } else if(jam > 0.60 && jam <= 0.75) {
          color = '#ffc46b'; // orange
        } else {
          color = '#6bff70'; // green
        }
        for (let index = 0; index < list_.length; index++) {
          const elements = list_[index]['points'];
          elements.forEach(element => {
            nestedList_.push([element['lat'], element['lng']]);
          });
          polylines.push(L.polyline(nestedList_, {color: color, smoothFactor: 6.0, noClip: true}));
          polylines.forEach(element => {
            element.addTo(map);
          });
          nestedList_ = []
        }
        // console.log(nestedList);
      });
    } catch (error) {
      console.log(error);
    }
  });
}