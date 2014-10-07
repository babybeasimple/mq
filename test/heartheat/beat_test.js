var expect = require('chai').expect;
var config = require('../../config/config');
var beat = require('../../src/heartbeat/beat');
var redisClient = require('../support/redisClient');

describe('heartbeat/beat.js', function() {
    describe('#setMasterPid', function() {
        describe('when value have not been set', function() {
            it('sets masterPid', function(done) {
                expect(function(stepDone) {
                    beat.setMasterPid(0, stepDone);
                }).to.change(function(stepDone) {
                    redisClient.get(config.MASTER_PID_KEY, stepDone);
                }, {
                    from: null,
                    to: '0',
                    callback: done
                });
            });
        });

        describe('when value have been set before', function() {
            beforeEach(function(done) {
                beat.setMasterPid(0, done);
            });

            it('does not changes masterPid', function(done) {
                expect(function(stepDone) {
                    beat.setMasterPid(1, stepDone);
                }).to.change(function(stepDone) {
                    redisClient.get(config.MASTER_PID_KEY, stepDone);
                }, {
                    from: '0',
                    to: '0',
                    callback: done
                });
            });
        });

        describe('when value have just set', function() {
            beforeEach(function(done) {
                beat.setMasterPid(0, done);
            });

            it('have ttl', function(done) {
                redisClient.pttl(config.MASTER_PID_KEY, function(err, reply) {
                    expect(reply).to.be.closeTo(config.HEARTBEAT_TIMEOUT, 10);
                    done();
                });
            });
        });

        describe('when value set move than heartbeat timeout time ago', function() {
            beforeEach(function(done) {
                beat.setMasterPid(0, function() {
                    setTimeout(done, config.HEARTBEAT_TIMEOUT);
                });
            });

            it('does not have ttl', function(done) {
                redisClient.pttl(config.MASTER_PID_KEY, function(err, reply) {
                    expect(reply).to.be.equal(-2);
                    done();
                });
            });
        });
    });

    describe('#prolongMasterPid', function() {
        before(function(done) {
            redisClient.set(config.MASTER_PID_KEY, 0, done);
        });
        before(function(done) {
            beat.prolongMasterPid(done);
        });

        it('sets mastePid ttl', function(done) {
            redisClient.pttl(config.MASTER_PID_KEY, function(err, reply) {
                expect(reply).to.be.closeTo(config.HEARTBEAT_TIMEOUT, 10);
                done();
            });
        });
    });
});
