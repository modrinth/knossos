import { customRef } from 'vue'

const focusableElementsSelector =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

const useFocusTrap = () => {
  let focusableElements = []
  let $firstFocusable
  let $lastFocusable
  const focusRef = customRef((track, trigger) => {
    let $trapEl = null
    return {
      get() {
        track()
        return $trapEl
      },
      set(value) {
        $trapEl = value
        value ? initFocusTrap() : clearFocusTrap()
        trigger()
      },
    }
  })

  const keyHandler = (e) => {
    const isTabPressed = e.key === 'Tab'
    if (!isTabPressed) return

    if (e.shiftKey) {
      if (document.activeElement === $firstFocusable) {
        $lastFocusable.focus()
        e.preventDefault()
      }
    } else if (document.activeElement === $lastFocusable) {
      $firstFocusable.focus()
      e.preventDefault()
    }
  }

  const initFocusTrap = () => {
    if (!focusRef.value) return
    focusableElements = focusRef.value.querySelectorAll(focusableElementsSelector)
    $firstFocusable = focusableElements[0]
    $lastFocusable = focusableElements[focusableElements.length - 1]
    document.addEventListener('keydown', keyHandler)
    $firstFocusable.focus()
  }

  const clearFocusTrap = () => {
    document.removeEventListener('keydown', keyHandler)
  }

  return { focusRef, initFocusTrap, clearFocusTrap }
}

export default useFocusTrap
