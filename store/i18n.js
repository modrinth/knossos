// @ts-check

export const state = () => ({
  /** Whether the language modal is showing. */
  showLanguageModal: false,
})

/**
 * @private
 * @typedef {ReturnType<typeof state>} State
 */

/** @type {import('vuex').GetterTree<State, State>} */
export const getters = {
  /**
   * @param {State} state
   * @returns {boolean} Whether the language modal is showing.
   */
  isLanguageModalShowing(state) {
    return state.showLanguageModal
  },
}

export const mutations = {
  /**
   * @param {State} state
   * @param {boolean} modalShown
   */
  SET_LANGUAGE_MODAL_SHOWN(state, modalShown) {
    state.showLanguageModal = modalShown
  },
}

/** @type {import('vuex').ActionTree<State, State>} */
export const actions = {
  toggleLanguageModal({ commit }, shown) {
    commit('SET_LANGUAGE_MODAL_SHOWN', shown)
  },
}
