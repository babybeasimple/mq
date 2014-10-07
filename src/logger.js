var logger = require('logger').createLogger();
var config = require('../config/config');

logger.setLevel(config.LOG_LEVEL);

module.exports = logger;
