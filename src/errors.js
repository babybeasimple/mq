var redisClient = require('./redisClient');
var config = require('../config/config');
var logger = require('./logger');

module.exports = {

    /**
     * Recurcive function, enqueue(pop) error messages from
     * redis list one by one, and when list is emply,
     *              calls callback function
     *
     * @param callback {Function} callback function
     */
    get: function(callback) {
        var _this = this;
        redisClient.lpop(config.ERRORS_LIST_KEY, function(err, reply) {
            if (err) throw err;
            if (reply === null) {
                callback();
            } else {
                logger.info('Error', reply);
                _this.get(callback);
            }
        });
    }
};
