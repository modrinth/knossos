/**
 * Checks whether the provided object has the required property.
 * @param {Object} instance Object which property is checked.
 * @param {string | symbol} prop Name of the property to check.
 * @returns {boolean} Whether the object has the required property.
 */
export const hasOwn = (instance, prop) =>
  Object.prototype.hasOwnProperty.call(instance, prop)
