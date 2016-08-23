'use strict';

var child_process = require('child_process');
var path = require("path");
var env = Object.assign({}, process.env);
var SEPARATOR = process.platform === "win32" ? ";" : ":";
env.PATH = path.resolve(path.join(__dirname, "/node_modules/.bin")) + SEPARATOR + env.PATH;

exports.spawnSync = function(cmd, args, opts) {

	opts = opts || {};
	opts.stdio = 'inherit';
	opts.env = env;

	if(process.platform === 'win32') {
		args = ['/c', cmd].concat(args);
		cmd = process.env.comspec;
	}

	return child_process.spawnSync(cmd, args, opts);
}

exports.spawn = function(cmd, args, opts) {

	return new Promise(function(resolve, reject) {

		opts = opts || {};
		opts.stdio = 'inherit';
		opts.env = env;

		if(process.platform === 'win32') {
			args = ['/c', cmd].concat(args);
			cmd = process.env.comspec;
		}

		var child = child_process.spawn(cmd, args, opts);

		child.on('close', (code, signal) => {

			//TODO: check codes for success/failure

			resolve({
				code: code,
				signal: signal
			});

		});

		child.on('error', (err) => {
			reject(err);
		});

	});
}