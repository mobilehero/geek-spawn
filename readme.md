> **Work in progresss**

# spawn

a cross-platform spawn replacement with promises

## install

[![npm version](https://badge.fury.io/js/%40geek%2Fspawn.svg)](https://badge.fury.io/js/%40geek%2Fspawn)
[![](http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)]()

```bash
$ npm install @geek/spawn
```

## usage

**Asynchronous**

```javascript

var spawn = require('@geek/spawn').spawn;
spawn('echo', ['this is a test']);

```

**Synchronous**

```javascript

var spawnSync = require('@geek/spawn').spawnSync;
spawnSync('echo', ['this is a test']);

```