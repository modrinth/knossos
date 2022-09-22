import Vue from 'vue'

const VNode = Object.getPrototypeOf(Vue.prototype._e())?.constructor ?? null

if (VNode == null) {
  throw new Error(
    'Something went terribly wrong because constructor for VNode cannot be found anymore'
  )
}

/**
 * Clones VNode. This code is based on private code from Vue. The cloned element
 * children will be the same children that are in original node, so it can be
 * worth cloning them as-well.
 *
 * @param {import('vue').VNode} vnode VNode to clone.
 * @returns {import('vue').VNode} Cloned VNode.
 */
export function cloneVNode(vnode) {
  // Avoiding TypeScript unawareness of certain VNode properties
  const v = /** @type {any} */ (vnode)

  var cloned = new VNode(
    v.tag,
    v.data,
    v.children && v.children.slice(),
    v.text,
    v.elm,
    v.context,
    v.componentOptions,
    v.asyncFactory
  )

  cloned.ns = v.ns
  cloned.isStatic = v.isStatic
  cloned.key = v.key
  cloned.isComment = v.isComment
  cloned.fnContext = v.fnContext
  cloned.fnOptions = v.fnOptions
  cloned.fnScopeId = v.fnScopeId
  cloned.asyncMeta = v.asyncMeta
  cloned.isCloned = true

  return cloned
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
