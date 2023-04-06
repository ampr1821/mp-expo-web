const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const axios = require('axios');
const base_url = 'http://localhost:5566/getroute'

// Serve static files from the public directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

function get_route(latlngs) {

  axios.get(base_url + '?lat1=' + latlngs[0] + '&lon1=' + latlngs[1] + '&lat2=' + latlngs[2] + '&lon2=' + latlngs[3])
    .then(function (response) {
      // handle success
      io.emit('route', response);
      console.log('route calculated and sent back');
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });


  // res.send(route_);
}

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('get route', (data) => {
    console.log(data);

    // call script here
    get_route(data);
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
