var errors = require('../src/errors');
var expect = require('chai').expect;
var config = require('../config/config');
var redisClient = require('./support/redisClient');

describe('errors.js', function() {
    describe('#get', function() {
        beforeEach(function(done) {
            redisClient.rpush(config.ERRORS_LIST_KEY, 0, done);
        });

        it('removes all messages from errors list', function(done) {
            expect(function(stepDone) {
                errors.get(stepDone);
            }).to.change(function(stepDone) {
                redisClient.llen(config.ERRORS_LIST_KEY, stepDone);
            }, {
                from: 1,
                to: 0,
                callback: done
            });
        });
    });
});
