// @ts-check

/**
 * Maps elements of the provided elements to properties passed as parameters
 * within call.
 *
 * Unfortunately, it does not seem to be possible to correctly type the
 * properties within the resulting object to their types within the array, so
 * all properties will have the `any` type.
 *
 * @example
 *   deunionize(['hello', 'world'], 'greeting', 'target')
 *   // => { greeting: 'hello', target: 'world' }
 *
 * @template {string | symbol | number} K
 * @template {any[]} U
 * @param {readonly [...U]} union Array of some elements.
 * @param {K[]} keys Names for array elements.
 * @returns {{ [P in K]: any }} Hashmap (object with no prototype) with elements
 *   mapped to properties in order of passed parameters.
 */
function deunionize(union, ...keys) {
  let i = 0
  const result = Object.create(null)
  for (const key of keys) {
    result[key] = union[i]
    i += 1
  }
  return result

  // // Ah, if only TypeScript was that smart :\
  // /**
  //  * @param {T} target Object to which the property is assigned.
  //  * @param {K} property Property to assign.
  //  * @param {V} value Value to assign.
  //  * @template {object} T Incoming object.
  //  * @template {string | symbol | number} K Name of the key.
  //  * @template [V=any] Type of value.
  //  * @return {T & { [_K in K]: V }}
  //  */
  // function assignProperty(target, property, value) {
  //   const mutableTarget = /** @type {any} */ (target)
  //   mutableTarget[property] = value
  //   return mutableTarget
  // }
}

/** @type {import('@nuxt/types').Plugin} */
export default (_ctx, inject) => {
  inject('deunionize', deunionize)
}
