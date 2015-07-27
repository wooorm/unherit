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

    it('should fool `instanceof` checks without `new`', function () {
        /**
         * Constructor which internally uses an `instanceof`
         * check.
         */
        function A(one, two, three) {
            assert.strictEqual(one, 'foo');
            assert.strictEqual(two, 'bar');
            assert.strictEqual(three, 'baz');

            /* istanbul ignore if */
            if (!(this instanceof A)) {
                assert(false);
            }

            this.values = [].slice.call(arguments);
        }

        var B = unherit(A);

        /* eslint-disable new-cap */
        var b = B('foo', 'bar', 'baz');
        /* eslint-enable new-cap */

        assert(b instanceof A);
        assert(b instanceof B);
        assert.deepEqual(b.values, ['foo', 'bar', 'baz']);
    });
});
