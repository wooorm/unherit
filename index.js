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

/**
 * Set `"constructor"` on `proto` to `Constructor`.
 *
 * Uses `Object.create`.
 *
 * @private
 * @param {Object} proto - Super-class prototype.
 * @param {Function} Constructor
 * @return {Object} - `proto` with a pached `constructor`.
 */
function define(proto, Constructor) {
    return Object.create(proto, {
      'constructor': {
        'value': Constructor,
        'enumerable': false,
        'writable': true,
        'configurable': true
      }
    });
}

/* istanbul ignore next */
/**
 * Set `"constructor"` on `proto` to `Constructor`.
 *
 * Manipulates `proto`.
 *
 * @private
 * @param {Object} proto - Super-class prototype.
 * @param {Function} Constructor
 * @return {Object} - `proto` with a pached `constructor`.
 */
function defineShim(proto, Constructor) {
    proto.constructor = Constructor;

    return proto;
}

/*
 * Method to used based on environment.
 */

var method = typeof Object.create === 'function' ?
    define :
    /* istanbul ignore next */ defineShim;

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

    Constructor.prototype = method(clone(Super.prototype), Constructor);

    return Constructor;
}

/*
 * Expose.
 */

module.exports = unherit;
