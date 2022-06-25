export const state = () => ({
  user: null,
  token: '',
  headers: {
    'x-ratelimit-key': process.server ? process.env.RATE_LIMIT_IGNORE_KEY : '',
  },
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_HEADERS(state, headers) {
    state.headers = headers
  },
}

export const actions = {
  async fetchUser({ commit, state }, { token }) {
    const headers = {
      headers: {
        Authorization: token,
        'x-ratelimit-key': process.server
          ? process.env.RATE_LIMIT_IGNORE_KEY
          : '',
      },
    }

    try {
      const user = (await this.$axios.get(`user`, headers)).data

      commit('SET_USER', user)
      commit('SET_TOKEN', token)
      commit('SET_HEADERS', headers)
    } catch (e) {
      console.error('Request for user info encountered an error: ', e)
    }
  },
}
