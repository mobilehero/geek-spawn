'use strict';

const _ = require("lodash");
const child_process = require('child_process');
const path = require("path");
const chalk = require("chalk");
const module_name = path.parse(module.id).name;
const SEPARATOR = process.platform === "win32" ? ";" : ":";
var env = Object.assign({}, process.env);
env.PATH = path.resolve(path.join(__dirname, "/node_modules/.bin")) + SEPARATOR + env.PATH;

// debug logger
var logger = (func_name) => {
	var prefix = func_name ? `[${module_name}.${func_name}] ` : `[${module_name}`;
	return _.wrap(require('debug')('geek-spawn'), (func, msg) => func(chalk.blue(`[${module_name}.execute] `) + msg));
}
let debug = logger();

exports.spawnSync = function(cmd, args, opts) {
	
	let debug = logger('spawnSync');

	// DEBUG: cmd
	console.debug(`🦠  cmd: ${JSON.stringify(cmd, null, 2)}`);

	// DEBUG: args
	console.debug(`🦠  args: ${JSON.stringify(args, null, 2)}`);

	if( _.isString(args)){
		args = args.split(' ');
	}

	// DEBUG: args
	console.debug(`🦠  args: ${JSON.stringify(args, null, 2)}`);

	opts = opts || {};
	opts.stdio = 'inherit';
	opts.env = env;

	if(process.platform === 'win32') {
		args = ['/c', cmd].concat(args);
		cmd = process.env.comspec;
	}

	return child_process.spawnSync(cmd, args, opts);
}

exports.spawnSync2 = params => {
	let debug = logger('spawnSync');

	// DEBUG: params
	console.debug(`🦠  params: ${JSON.stringify(params, null, 2)}`);

	
	const paramsArray = _.split(_.trim(params), /\s* \s*/g).filter(o => o);

	// DEBUG: paramsArray
	console.debug(`🦠  paramsArray: ${JSON.stringify(paramsArray, null, 2)}`);

	const cmd = paramsArray[0];
	const args = _.slice(paramsArray, 1);

	const opts = {
		stdio: 'inherit',
		env,
	};

	if(process.platform === 'win32') {
		args = ['/c', cmd].concat(args);
		cmd = process.env.comspec;
	}

	return child_process.spawnSync(cmd, args, opts);
}

exports.spawn = function(cmd, args, opts) {
	// console.debug('📌  you are here → spawn() ');
	let debug = logger('spawn');
	return new Promise(function(resolve, reject) {
		if( _.isString(args)){
			args = args.split(' ');
		}

		opts = opts || {};
		_.defaults(opts, {
			successfulExitCodes: [0],
			stdio: 'inherit',
			env: env
		})

		if(process.platform === 'win32') {
			args = ['/c', cmd].concat(args);
			cmd = process.env.comspec;
		}

		debug("Spawning in " + opts.cwd + ":  " + cmd + " " + args.join(" "));
		var child = child_process.spawn(cmd, args, opts);

		child.on('close', (code, signal) => {

			if(!_.includes(opts.successfulExitCodes, code)) {
				var err = {
					code: code,
					message: "'" + cmd + " " + _.join(args, " ") + "' failed with code " + code,
					childProcess: child,
					toString() {
						return this.message;
					}
				};

				// DEBUG: err
				console.debug(`🦠  err: ${JSON.stringify(err, null, 2)}`);

				reject(err);
			}

			resolve({
				code: code,
				signal: signal
			});

		});

		child.on('error', err => {
			reject(err);
		});

	});
}