import {EventEmitter} from 'events'
import test from 'tape'
import {unherit} from './index.js'

test('unherit(Super)', (t) => {
  let Emitter = unherit(EventEmitter)

  // @ts-expect-error: TS is wrong, it does exist.
  t.equal(Emitter.prototype.defaultMaxListeners, undefined)
  // @ts-expect-error: TS is wrong, it does exist.
  Emitter.prototype.defaultMaxListeners = 0

  // @ts-expect-error
  t.equal(new Emitter().defaultMaxListeners, 0, 'should work (1)')
  // @ts-expect-error
  t.equal(new EventEmitter().defaultMaxListeners, undefined, 'should work (2)')

  t.equal(new Emitter().constructor, Emitter, 'should work (3)')
  t.equal(new EventEmitter().constructor, EventEmitter, 'should work (4)')

  Emitter = unherit(EventEmitter)

  t.ok(new Emitter() instanceof EventEmitter, 'should fool `instanceof` checks')

  class A {
    /**
     * Constructor which internally uses an `instanceof` check.
     *
     * @constructor
     * @param {string} one
     * @param {string} two
     * @param {string} three
     */
    constructor(one, two, three) {
      t.equal(one, 'foo')
      t.equal(two, 'bar')
      t.equal(three, 'baz')
      t.ok(this instanceof A)
      /** @type {unknown[]} */
      this.values = [one, two, three]
    }
  }

  const B = unherit(A)
  const b = new B('foo', 'bar', 'baz')

  t.ok(b instanceof A, 'should support classes (1)')
  t.ok(b instanceof B, 'should support classes (2)')
  t.deepEqual(b.values, ['foo', 'bar', 'baz'], 'support classes (3)')

  /** @type {(() => void) & {prototype: {values: unknown[]}}} */
  function C() {}

  // TS doesn’t like `prototype`s.
  // type-coverage:ignore-next-line
  C.prototype.values = [1, 2]

  class Proto extends C {}

  function D() {}

  D.prototype = new Proto()
  D.prototype.values = [1, 2, 3]
  // @ts-expect-error: correct, it does not exist.
  D.prototype.object = {a: true}

  const E = unherit(D)

  // This failed in 1.0.4
  t.deepEqual(
    E.prototype.values,
    [1, 2, 3],
    'shouldn’t fail on inheritance (1)'
  )
  t.deepEqual(new E().values, [1, 2, 3], 'shouldn’t fail on inheritance (2)')

  E.prototype.values.push(4)

  const F = unherit(D)

  t.deepEqual(F.prototype.values, [1, 2, 3], 'should clone values (1)')
  t.deepEqual(new F().values, [1, 2, 3], 'should clone values (2)')

  t.deepEqual(new F().object, {a: true}, 'should clone values (3)')

  t.end()
})
