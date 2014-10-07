// TODO: tune up config to be immutable
var config = {};

config.GET_ERRORS_ARG_KEY = 'getErrors';
config.CLUSTER_SIZE_ARG_KEY = 'size';
config.REDIS_PREFIX = 'mq:';
config.QUEUE_KEY = config.REDIS_PREFIX + 'queue';
config.ERRORS_LIST_KEY = config.REDIS_PREFIX + 'errors';
config.MASTER_PID_KEY = config.REDIS_PREFIX + 'masterPid';
config.DEFAULT_CLUSTER_SIZE = 8;
config.GENERATOR_PUSH_INTERVAL = 500;
config.HEARTBEAT_INTERVAL = 100;
config.HEARTBEAT_TIMEOUT = 200;
config.GRANT_MASTER_MESSAGE = 'masterGranted';
config.LOG_LEVEL = 'debug';

module.exports = config;
