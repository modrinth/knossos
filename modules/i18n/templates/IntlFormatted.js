//@ts-check

import Vue from 'vue'
import { createTextNode, isVNode } from './vueUtils'

/**
 * @private
 * @typedef {import('@formatjs/intl').FormatMessageFn<import('vue').VNode>} _FmtFunction
 */

/**
 * @param {unknown} value Value to check.
 * @returns {value is import('./i18n.types').MessageDescriptor} Whether the
 *   value is a valid message descriptor.
 */
function isMessageDescriptor(value) {
  return (
    value != null &&
    typeof value === 'object' &&
    'id' in value &&
    typeof (/** @type {any} */ (value).id) === 'string'
  )
}

/**
 * @param {import('~/modules/i18n/templates/i18n').IntlController} controller
 *   Controller which this functional component will use to format the messages.
 * @returns Functional component to format Intl messages into Vue nodes.
 */
export function createIntlFormattedComponent(controller) {
  return Vue.extend({
    functional: true,

    props: {
      /** Message identifier. */
      /**
       * @type {import('vue').PropOptions<
       *   | import('./i18n.types').MessageID
       *   | import('./i18n.types').MessageDescriptor
       * >}
       */
      messageId: {
        required: false,
        validator(value) {
          return typeof value === 'string' || isMessageDescriptor(value)
        },
      },
      /**
       * @type {import('vue').PropOptions<
       *   | import('@formatjs/icu-messageformat-parser').MessageFormatElement[]
       *   | string
       * >}
       */
      message: {
        required: false,
        validator(value) {
          return typeof value === 'string' || Array.isArray(value)
        },
      },
      /** @type {import('vue').PropOptions<Parameters<_FmtFunction>[3]>} */
      values: {
        default() {
          return {}
        },
        validator(value) {
          return typeof value === 'object'
        },
      },
      /** @type {import('vue').PropOptions<string[]>} */
      tags: {
        type: Array,
        default() {
          return []
        },
        validator(value) {
          return (
            Array.isArray(value) && value.every((x) => typeof x === 'string')
          )
        },
      },
    },

    render(createElement, context) {
      if (context.props.messageId == null && context.props.message == null) {
        throw new Error(
          'IntlFormatted cannot be rendered without "message-id" or "message" properties'
        )
      }

      /**
       * @private
       * @typedef {string | number | import('vue').VNode[] | undefined} _Values
       */

      /**
       * @private
       * @typedef {(chunks: _Values[]) => _Values} _Instantinator
       */

      /**
       * Initial values are passed to the slots.
       *
       * @type {Record<string, unknown>}
       */
      const initialValues = Object.create(null)

      /**
       * Provided values are values that were automatically provided by the
       * IntlFormatted component. They are also used to format the message.
       *
       * Initial values are to be merged before assigning provided values.
       *
       * @type {Record<string, _Values | _Instantinator>}
       */
      const values = Object.create(null)

      if (context.props.values != null) {
        Object.assign(initialValues, context.props.values)
        Object.assign(values, initialValues)
      }

      if (Array.isArray(context.props.tags)) {
        for (const tag of context.props.tags) {
          /** @type {string} */
          let key

          /** @type {import('vue').Component | string} */
          let component

          if (Array.isArray(tag)) {
            key = tag[0]
            component = tag[1]
          } else {
            if (typeof tag !== 'string') {
              throw new Error(
                'Custom components must be provided as array of [name, component]'
              )
            }

            key = tag
            component = tag
          }

          values[key] = (children) => {
            const newChildren = []

            for (const child of children) {
              if (Array.isArray(child)) {
                newChildren.push(...child)
              } else {
                newChildren.push(isVNode(child) ? child : createTextNode(child))
              }
            }

            return [createElement(component, newChildren)]
          }
        }
      } else if (context.props.tags != null) {
        throw new Error(
          'Property "tags" of IntlFormatted needs to be of array type or null / undefined'
        )
      }

      for (const [name, slot] of Object.entries(context.scopedSlots)) {
        if (name.startsWith('~')) {
          values[name.slice(1)] = slot({
            values: initialValues,
          })
        } else {
          values[name] = (children) =>
            slot({
              children,
              values: initialValues,
            })
        }
      }

      /**
       * @private
       * @typedef {import('vue').VNode | string} _FormattedValue
       */

      /** @type {_FormattedValue | _FormattedValue[]} */
      let formatted

      if (context.props.message != null) {
        formatted = controller.formats.customMessage(
          context.props.message,
          values
        )
      } else if (context.props.messageId != null) {
        formatted = controller.intl.formatMessage(
          typeof context.props.messageId === 'string'
            ? {
                id: context.props.messageId,
              }
            : context.props.messageId,
          values
        )
      } else {
        // should never end up here
        throw new Error(
          'Illegal state: neither message nor messageId properties provided'
        )
      }

      if (!Array.isArray(formatted)) {
        formatted = [formatted]
      }

      return formatted.flat().map((child) => {
        return isVNode(child) ? child : createTextNode(child)
      })
    },
  })
}

/** @typedef {ReturnType<typeof createIntlFormattedComponent>} IntlFormattedComponentType */
