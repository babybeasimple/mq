var handler = require('../src/handler');
var expect = require('chai').expect;
var config = require('../config/config');
var redisClient = require('./support/redisClient');

describe('handler.js', function() {
    describe('#dequeue', function() {
        before(function() {
            redisClient.rpush(config.QUEUE_KEY, 0);
        });

        it('removes message from queue', function(done) {
            expect(function(stepDone) {
                handler.dequeue(stepDone);
            }).to.change(function(stepDone) {
                redisClient.llen(config.QUEUE_KEY, stepDone);
            }, {
                from: 1,
                to: 0,
                callback: done
            });
        });
    });

    describe('#registerError', function() {
        describe('when error occurs', function() {
            it('adds error to list', function(done) {
                expect(function(stepDone) {
                    handler.registerError(true, 0, stepDone);
                }).to.change(function(stepDone) {
                    redisClient.llen(config.ERRORS_LIST_KEY, stepDone);
                }, {
                    by: 1,
                    callback: done
                });
            });
        });

        describe('when error does not occur', function() {
            it('do not adds error to list', function(done) {
                expect(function(stepDone) {
                    handler.registerError(false, 0, stepDone);
                }).to.change(function(stepDone) {
                    redisClient.llen(config.ERRORS_LIST_KEY, stepDone);
                }, {
                    by: 0,
                    callback: done
                });
            });
        });
    });
});
