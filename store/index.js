export const actions = {
  nuxtServerInit({ commit }, { query }) {
    if (query.code) {
      commit('auth/setToken', query.code)
    }
  },
}
