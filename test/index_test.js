var server = require('../lib/server');
var should = require('should');

describe('test', function () {
    it('test', function (done) {
        server.should.not.be.null;

        done();
    });
});
