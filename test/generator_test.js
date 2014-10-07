var generator = require('../src/generator');
var expect = require('chai').expect;
var config = require('../config/config');
var redisClient = require('redis').createClient();

describe('generator.js', function() {
    describe('#enqueue', function() {
        it('adds message to queue', function(done) {
            expect(function(stepDone) {
                generator.enqueue(stepDone);
            }).to.change(function(stepDone) {
                redisClient.llen(config.QUEUE_KEY, stepDone);
            }, {
                from: 0,
                to: 1,
                callback: done
            });
        });
    });
});
