'use strict';

var _ = require("lodash");
var child_process = require('child_process');
var path = require("path");
var env = Object.assign({}, process.env);
var SEPARATOR = process.platform === "win32" ? ";" : ":";
env.PATH = path.resolve(path.join(__dirname, "/node_modules/.bin")) + SEPARATOR + env.PATH;

exports.spawnSync = function(cmd, args, opts) {

	opts = opts || {};
	opts.stdio = 'inherit';
	opts.env = env;

	if (process.platform === 'win32') {
		args = ['/c', cmd].concat(args);
		cmd = process.env.comspec;
	}

	return child_process.spawnSync(cmd, args, opts);
}

exports.spawn = function(cmd, args, opts) {

	var successfulExitCodes = (opts && opts.successfulExitCodes) || [0];
	return new Promise(function(resolve, reject) {

		opts = opts || {};
		opts.successfulExitCodes = opts.successfulExitCodes || [0];
		opts.stdio = 'inherit';
		opts.env = env;

		if (process.platform === 'win32') {
			args = ['/c', cmd].concat(args);
			cmd = process.env.comspec;
		}

		var child = child_process.spawn(cmd, args, opts);

		child.on('close', (code, signal) => {

			if (!_.includes(opts.successfulExitCodes, code)) {
				var err = {
					code: code,
					message: "'" + cmd + " " + _.join(args," ") + "' failed with code " + code,
					childProcess: child,
					toString() {
						return this.message;
					}
				};

				reject(err);
			}

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