var redisClient = require('redis').createClient();
var config = require('../../config/config');

module.exports = {
    getMasterPid: function(callback) {
        redisClient.get(config.MASTER_PID_KEY, callback);
    },

    /**
     * Set parent process pid id to redis only if key not exists
     *             add expiration time to key
     *
     * @param parentProcessPid {Integer} parent process id
     * @param callback {Function} callback function
     */
    setMasterPid: function(parentProcessPid, callback) {
        var _this = this;
        redisClient.set(
            config.MASTER_PID_KEY,
            parentProcessPid,
            'NX',
            'PX',
            config.HEARTBEAT_TIMEOUT,
            callback
        );
    },

    /**
     * Prolong master pid expiration time in redis
     *
     * @param callback {Function} callback function
     */
    prolongMasterPid: function(callback) {
        redisClient.pexpire(config.MASTER_PID_KEY, config.HEARTBEAT_TIMEOUT, callback);
    },

    /**
     * Callback function. Sends message to master process
     *      if manage to set value to redis
     *
     * @param err {Boolean} error
     * @param reply {String} redis reply
     */
    sendMasterGrantToParent: function(err, reply) {
        if (err) throw err;
        if (reply === 'OK') process.send(config.GRANT_MASTER_MESSAGE);
    },

    /**
     * Handles one tick of heartbeat
     *
     * @param parentProcessPid {Integer} parent process id
     */
    beat: function(parentProcessPid) {
        var _this = this;
        this.getMasterPid(function(err, reply) {
            if (err) throw err;

            switch (reply) {
                case null:
                    _this.setMasterPid(parentProcessPid, _this.sendMasterGrantToParent);
                    break;

                case parentProcessPid.toString():
                    _this.prolongMasterPid();
                    break;
            }
        });
    }
};
