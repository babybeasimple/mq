var redisClient = require('./redisClient');
// use separate connection for dequeue 'cuz `brpop` is bloking command
var dequeueRedisClient = require('redis').createClient();
var config = require('../config/config');
var logger = require('./logger');

module.exports = {
    handleEvent: function(msg, callback) {
        function onComplete() {
            var err = Math.random() > 0.85;
            callback(err, msg);
        }

        // processing takes time...
        setTimeout(onComplete, Math.floor(Math.random() * 1000));
    },

    /**
     * Dequeue message from redis list, uses redis `brpop` command
     * this command is bloking one. If redis list have items it will
     * pop item, but if list is emply it will block process,
     * that is why we used separate redis connection, to not block
     *              other commands
     *
     * @param callback {Function} callback function
     */
    dequeue: function(callback) {
        dequeueRedisClient.brpop(config.QUEUE_KEY, 0, callback);
    },

    /**
     * If massage failed to handle, writes it to redis errors list
     *
     * @param err {Boolean} error
     * @param msg {String} message failed to habdle
     * @param callback {Function} callback function
     */
    registerError: function(err, msg, callback) {
        if (err) {
            redisClient.rpush(config.ERRORS_LIST_KEY, msg, callback);
            logger.debug('Writing error', msg);
        } else {
            callback(err, msg);
        }
    },

    /**
     * Recurcive function, dequeue massage from queue and
     *      handle it, then next message, and so on
     */
    work: function() {
        var _this = this;
        this.dequeue(function(err, reply) {
            if (err) throw err;
            logger.debug('Handle message', reply[1]);
            _this.handleEvent(reply[1], function(err, msg) {
                _this.registerError(err, msg, function(err, reply) {
                    if (err) throw err;
                });
             });
            _this.work();
        });
    },

    start: function() {
        logger.info('Start handling queueu');
        this.work();
    }
};
