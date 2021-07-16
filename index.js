/**
 * Create a custom constructor which can be modified without affecting the
 * original class.
 *
 * @template {{new(...args: Args): Instance}} Class
 * @template {any[]} Args
 * @template Instance
 * @param {Class & {new (...args: Args): Instance}} Super
 * @return {Class & ((...args: Args) => Instance)}
 */
export function unherit(Super) {
  var proto
  var key
  var value

  // @ts-expect-error hush
  const Of = class extends Super {}

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

  // @ts-expect-error `extends` above ensures that attributes will match
  return Of
}
