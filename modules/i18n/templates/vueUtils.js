import Vue from 'vue'

const VNode = Object.getPrototypeOf(Vue.prototype._e())?.constructor ?? null

if (VNode == null) {
  throw new Error(
    'Something went terribly wrong because constructor for VNode cannot be found anymore'
  )
}

/**
 * Checks whether the provided value is an instance of VNode.
 *
 * @param {unknown} value Value to check.
 * @returns {value is import('vue').VNode} `true` if value is a VNode, otherwise
 *   `false`.
 */
export function isVNode(value) {
  return value instanceof VNode
}

/**
 * Creates VNode specifically for text.
 *
 * @param {unknown} value Text inside the node, any passed value will be
 *   converted to string using `String(value)`.
 * @returns {import('vue').VNode} VNode or text.
 */
export function createTextNode(value) {
  return Vue.prototype._v(value)
}
