const express = require('express')
const path = require('path')
const app = express()
const port = 1234

app.use(express.static(path.join(__dirname,'public')))

app.listen(port, ()=> {
	console.log('listening on port: ' + port)
})

app.get('/', (req,res)=> {
	res.sendFile('index.html')
})