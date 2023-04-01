const express = require('express');
const app = express();
const spawn = require('child_process').spawn;

const port = 5566;
app.listen(port,function() {
	console.log('listening on port '+port);
});

app.get('/',function(req,res) {
	arg1 = req.query.lat1;
	arg2 = req.query.lon1;
	arg3 = req.query.lat2;
	arg4 = req.query.lon2;
	console.log('request received');
	console.log(req.query)
	
	const pythonProcess = spawn('venv/bin/python',["./get_route.py", arg1, arg2, arg3, arg4]);
	pythonProcess.stderr.on("data", data => {
    	console.log(`stderr: ${data}`);
    	res.send('Some error occurred');
	});
	console.log('python execution')
	
	pythonProcess.stdout.on('data', (data) => {
 		// Do something with the data returned from python script
		console.log(data)
		console.log('Request complete');
 		res.send(data);
 		console.log("Here")
	});
});

//http://192.168.1.12:5566/?lat1=12.9246573&lon1=77.5582014&lat2=13.0110216'&lon2=77.6747875