const express = require('express');
const app = express();

// Serve static files from the public directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/public/index.html');
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
