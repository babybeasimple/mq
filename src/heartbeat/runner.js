var beat = require('./beat');
var config = require('../../config/config');
var params = JSON.parse(new Buffer(process.argv[2], 'base64').toString('utf8'));
var parentProcessPid = params.parentProcessPid;

setInterval(function() {
    beat.beat(parentProcessPid);
}, config.HEARTBEAT_INTERVAL);
