const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const spawn = require('child_process').spawn;

// Serve static files from the public directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

function get_route(latlngs) {
  const pythonProcess = spawn('venv/bin/python', ["./astar_routing.py", latlngs[0], latlngs[1], latlngs[2], latlngs[3]]);
  pythonProcess.stderr.on("data", data => {
    console.log(`stderr: ${data}`);
  });
  console.log('python execution')

  pythonProcess.stdout.on('data', (data) => {
    // Do something with the data returned from python script
    console.log('request complete');
    route_data = String(data).split('\n');
    if (route_data.at(-1) == '')
      route_data.pop(-1) // popping out the last character
    route_ = []
    route_data.forEach(element => {
      route_.push(element.split(','))
    });
    io.emit('route', route_);

    console.log('route calculated and sent back');
    // res.send(route_);
  });
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
