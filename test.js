import {EventEmitter} from 'events'
import test from 'tape'
import {unherit} from './index.js'

test('unherit(Super)', function (t) {
  var Emitter = unherit(EventEmitter)

  t.equal(Emitter.prototype.defaultMaxListeners, undefined)

  Emitter.prototype.defaultMaxListeners = 0

  // @ts-ignore
  t.equal(new Emitter().defaultMaxListeners, 0, 'should work (1)')
  // @ts-ignore
  t.equal(new EventEmitter().defaultMaxListeners, undefined, 'should work (2)')

  t.equal(new Emitter().constructor, Emitter, 'should work (3)')
  t.equal(new EventEmitter().constructor, EventEmitter, 'should work (4)')

  Emitter = unherit(EventEmitter)

  t.ok(new Emitter() instanceof EventEmitter, 'should fool `instanceof` checks')
  /**
   * Constructor which internally uses an `instanceof` check.
   *
   * @constructor
   * @param {string} one
   * @param {string} two
   * @param {string} three
   */
  function A(one, two, three) {
    t.equal(one, 'foo')
    t.equal(two, 'bar')
    t.equal(three, 'baz')
    t.ok(this instanceof A)

    this.values = [].slice.call(arguments)
  }

  var B = unherit(A)

  var b = new B('foo', 'bar', 'baz')

  t.ok(b instanceof A, 'should fool `instanceof` without `new` (1)')
  t.ok(b instanceof B, 'should fool `instanceof` without `new` (2)')

  t.deepEqual(
    b.values,
    ['foo', 'bar', 'baz'],
    'should fool `instanceof` without `new` (3)'
  )

  var E
  var F

  function C() {}

  C.prototype.values = [1, 2]

  function Proto() {}

  function D() {}
  Proto.prototype = C.prototype

  D.prototype = new Proto()
  D.prototype.values = [1, 2, 3]
  D.prototype.object = {a: true}

  E = unherit(D)

  // This failed in 1.0.4
  t.deepEqual(
    E.prototype.values,
    [1, 2, 3],
    'shouldn’t fail on inheritance (1)'
  )
  t.deepEqual(new E().values, [1, 2, 3], 'shouldn’t fail on inheritance (2)')

  E.prototype.values.push(4)

  F = unherit(D)

  t.deepEqual(F.prototype.values, [1, 2, 3], 'should clone values (1)')
  t.deepEqual(new F().values, [1, 2, 3], 'should clone values (2)')

  t.deepEqual(new F().object, {a: true}, 'should clone values (3)')

  t.end()
})
