var redisClient = require('./redisClient');
var config = require('../config/config');

module.exports = {

    generateMessage: function() {
        this.cnt = this.cnt || 0;
        return this.cnt++;
    },

    /**
     * Enqueue messages to redis list
     *
     * @param callback {Function} callback function
     */
    enqueue: function(callback) {
        redisClient.rpush(
            config.QUEUE_KEY,
            this.generateMessage(),
            callback
        );
    },

    /**
     * Start generator, enqueue message every period
     *
     * @param interval {Integer} generator push time
     *            in milliseconds
     */
    start: function(interval) {
        var _this = this;
        setInterval(function() {
            _this.enqueue(function(err) {
                if (err) throw err;
            });
        }, interval);
    }
};
