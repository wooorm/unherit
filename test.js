'use strict';

/* eslint-env mocha */

/*
 * Dependencies.
 */

var assert = require('assert');
var EventEmitter = require('events').EventEmitter;
var unherit = require('./');

describe('unherit(Super)', function () {
    it('should work', function () {
        var Emitter = unherit(EventEmitter);

        assert.equal(Emitter.prototype.defaultMaxListeners, undefined);

        Emitter.prototype.defaultMaxListeners = 0;

        assert.equal(new Emitter().defaultMaxListeners, 0);
        assert.equal(new EventEmitter().defaultMaxListeners, undefined);

        assert.equal(new Emitter().constructor, Emitter);
        assert.equal(new EventEmitter().constructor, EventEmitter);
    });

    it('should fool `instanceof` checks', function () {
        var Emitter = unherit(EventEmitter);

        assert(new Emitter() instanceof EventEmitter);
    });
});
