import inherits from 'inherits'

/**
 * Create a custom constructor which can be modified without affecting the
 * original class.
 *
 * @template Instance
 * @template Args
 * @template {{ new(...Args): Instance }} Class
 * @param {Class} Super
 * @return {(new(...Args) => Instance) & ((...Args) => Instance)}
 */
export function unherit(Super) {
  var proto
  var key
  var value

  inherits(Of, Super)
  inherits(From, Of)

  // Clone values.
  proto = Of.prototype

  // We specifically want to get *all* fields, not just own fields.
  // eslint-disable-next-line guard-for-in
  for (key in proto) {
    value = proto[key]

    if (value && typeof value === 'object') {
      proto[key] = 'concat' in value ? value.concat() : Object.assign({}, value)
    }
  }

  // @ts-ignore
  return Of

  /**
   * Constructor accepting a single argument, which itself is an `arguments`
   * object.
   * @class
   * @param {IArguments} parameters
   */
  function From(parameters) {
    return Super.apply(this, parameters)
  }

  /**
   * Constructor accepting variadic arguments.
   *
   * @class
   * @this {Class}
   */
  function Of() {
    return this instanceof Of
      ? Super.apply(this, arguments)
      : new From(arguments)
  }
}
