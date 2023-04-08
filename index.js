const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Serve static files from the public directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('get ip', (_) => {
    console.log('IP req')
    socket.emit('ip', process.env.API_HOST);
  });

  socket.on('broad', (data) => {
    console.log('Path Broadcast')
    io.emit('route', data);
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
