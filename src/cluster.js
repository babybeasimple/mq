var spawn = require('child_process').spawn;
var argv = require('minimist')(process.argv.slice(2));
var config = require('../config/config');
var logger = require('./logger');
var clusterSize = argv[config.CLUSTER_SIZE_ARG_KEY] || config.DEFAULT_CLUSTER_SIZE;

function attachEvents(child) {
    child.stdout.on('data', function (data) {
        console.log(child.pid + ' ' + data);
    });

    child.stderr.on('data', function (data) {
        console.log(child.pid + ' ' + data);
    });
}

logger.info(process.pid, 'Starting ' + clusterSize + ' size cluster');

for (var i = 0; i < clusterSize; i++) {
    attachEvents(spawn('node', ['./app.js']));
}
