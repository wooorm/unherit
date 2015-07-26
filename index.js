/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module unherit
 * @fileoverview Create a custom constructor which can be modified
 *   without affecting the original class.
 * @example
 *   var EventEmitter = require('events').EventEmitter;
 *   var Emitter = unherit(EventEmitter);
 *   // Create a private class which acts just like
 *   // `EventEmitter`.
 *
 *   Emitter.prototype.defaultMaxListeners = 0;
 *   // Now, all instances of `Emitter` have no maximum
 *   // listeners, without affecting other `EventEmitter`s.
 */

'use strict';

/*
 * Dependencies.
 */

var clone = require('clone');
var inherits = require('inherits');

/**
 * Create a custom constructor which can be modified
 * without affecting the original class.
 *
 * @param {Function} Super - Super-class.
 * @return {Function} - Constructor acting like `Super`,
 *   which can be modified without affecting the original
 *   class.
 */
function unherit(Super) {
    /**
     * Constructor.
     */
    function Constructor() {
        return Super.apply(this, arguments);
    }

    /*
     * Both do duplicate work. However, cloning the
     * prototype ensures clonable things are cloned
     * and thus used. The `inherits` call ensures
     * `instanceof` still thinks an instance subclasses
     * `Super`.
     */

    Constructor.prototype = clone(Super.prototype);

    inherits(Constructor, Super);

    return Constructor;
}

/*
 * Expose.
 */

module.exports = unherit;
