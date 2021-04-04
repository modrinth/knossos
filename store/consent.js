export const state = () => ({
  is_consent_given: false,
  scopes_allowed: [],
})
export const mutations = {
  set_consent(state, val) {
    state.is_consent_given = val
  },
  add_scope(state, val) {
    state.scopes_allowed.push(val)
  },
}
export const actions = {
  loadFromCookies(state, $cookies) {
    state.commit('set_consent', $cookies.get('modrinth-consent') === 'true')
    const scopes = $cookies.get('modrinth-scopes')
    if (scopes == null) return
    scopes.forEach((elem) => {
      state.commit('add_scope', elem)
    })
  },
}
export const getters = {
  is_scope_allowed: (state) => (id) => {
    return state.scopes_allowed.contains(id)
  },
}
