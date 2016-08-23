var gitpull = function() {
	var moment = require('moment');
	var now = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
	console.log(now + ':  inside gitpull');

	var spawn = require('child_process').spawn;

	//kick off process
	var child = spawn('git', ['pull']);

	//spit stdout to screen
	child.stdout.on('data', function(data) { process.stdout.write(data.toString()); });

	//spit stderr to screen
	child.stderr.on('data', function(data) { process.stdout.write(data.toString()); });

	child.on('close', function(code) {
		console.log("Finished: " + code);
		console.log("-----------------------------------------------------");
		setTimeout(gitpull, 10000);
	});

}

gitpull();