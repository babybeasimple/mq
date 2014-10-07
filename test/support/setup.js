var chai = require('chai');
var sinon = require('sinon');
var redisClient = require('./redisClient');

chai.use(require('sinon-chai'));
chai.use(require('chai-change'));

beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
    this.redisClient = redisClient;
});

afterEach(function () {
    this.sandbox.restore();
    this.redisClient.flushdb();
});
