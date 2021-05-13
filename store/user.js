export const state = () => ({
  notifications: {
    count: 0,
    lastUpdated: 0,
  },
})

export const mutations = {
  SET_NOTIFICATIONS(state, count) {
    state.notifications.count = count
    state.notifications.lastUpdated = Date.now()
  },
}

export const actions = {
  async fetchNotifications({ commit, state, rootState }) {
    if (rootState.auth.user.id) {
      const notifications = (
        await this.$axios.get(
          `https://api.modrinth.com/api/v1/user/${rootState.auth.user.id}/notifications`,
          rootState.auth.headers
        )
      ).data

      commit('SET_NOTIFICATIONS', notifications.length)
    }
  },
}
