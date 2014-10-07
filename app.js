var path = require('path');
var config = require('./config/config');
var errors = require('./src/errors');
var generator = require('./src/generator');
var handler = require('./src/handler');
var logger = require('./src/logger');
var argv = require('minimist')(process.argv.slice(2));
var getErrors = argv[config.GET_ERRORS_ARG_KEY];

if (getErrors) {
    logger.info('The list of erros:');
    errors.get(function(err, reply) {
        // callback function calls if redis list is emply,
        // so it terminates proccess
        process.exit();
    });
} else {
    // This is a lazy way to pass structured arguments to a child process
    // without having to care about what they contain: convert to JSON,
    // and then base 64 encode that string.
    var heartbeatProcessArguments = new Buffer(
        JSON.stringify({
            parentProcessPid: process.pid,
        }), 'utf8'
    ).toString('base64');

    // setTimeout() and setInterval() are not guaranteed to execute on time
    // and within the same process hearbeat could be delayed, so we create
    // separate process for heartbeat to minify this delays, also this child
    // process used separate redis connestion that also minify heartbeat deviations
    var heartbeatProcess = require('child_process').fork(
        path.join(__dirname, './src/heartbeat/runner.js'), [heartbeatProcessArguments], {
            // Pass over all of the environment.
            env: process.ENV,
            // Share stdout/stderr, so we can hear the inevitable errors.
            silent: false
        }
    );

    // listern message from heartbeat process, to be grated as master and run generator
    heartbeatProcess.on('message', function(message) {
        if (message === config.GRANT_MASTER_MESSAGE) {
            logger.warn('Failed to find generator process, new master is', process.pid);

            generator.start(config.GENERATOR_PUSH_INTERVAL);
        }
    });

    // kill heartbeat process on SIGNINT
    // FIXME: Can't handle kill -9 here
    // possible way to solve it - add function to hearbeat/beat module
    // which will polling if master process pid exists in system
    // it can be implemented using process.kill(0, callback) function
    // with handling exeption inside callback
    // but I'm still searching for better solution
    process.on('SIGINT', function() {
        heartbeatProcess.kill();
    });

    // kill heartbeat process on exit
    process.on('exit', function() {
        heartbeatProcess.kill();
    });

    // if heartbeat process died we have problems
    // so we should terminate parent process too
    heartbeatProcess.on('exit', function() {
        process.exit();
    });

    // starts messages handler
    handler.start();
}
