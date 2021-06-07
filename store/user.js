export const state = () => ({
  notifications: [],
  follows: [],
  projects: [],
  lastUpdated: 0,
})

export const mutations = {
  SET_NOTIFICATIONS(state, notifications) {
    state.notifications = notifications
  },
  SET_FOLLOWS(state, follows) {
    state.follows = follows
  },
  SET_PROJECTS(state, projects) {
    state.projects = projects
  },
  SET_LAST_UPDATED(state, lastUpdated) {
    state.lastUpdated = lastUpdated
  },
}

export const actions = {
  async fetchAll({ commit, state, rootState }, { force = false } = {}) {
    if (
      rootState.auth.user &&
      rootState.auth.user.id &&
      (force || Date.now() - state.notifications.lastUpdated > 300000)
    ) {
      const [notifications, follows, projects] = (
        await Promise.all([
          this.$axios.get(
            `user/${rootState.auth.user.id}/notifications`,
            rootState.auth.headers
          ),
          this.$axios.get(
            `user/${rootState.auth.user.id}/follows`,
            rootState.auth.headers
          ),
          this.$axios.get(
            `user/${rootState.auth.user.id}/projects`,
            rootState.auth.headers
          ),
        ])
      ).map((it) => it.data)

      commit('SET_NOTIFICATIONS', notifications)
      commit('SET_FOLLOWS', follows)
      commit('SET_PROJECTS', projects)
      commit('SET_LAST_UPDATED', Date.now())
    }
  },
  async followProject({ commit, state, rootState }, project) {
    await this.$axios.post(
      `project/${project.id}/follow`,
      {},
      rootState.auth.headers
    )

    commit('SET_FOLLOWS', state.follows.concat(project))
  },
  async unfollowProject({ commit, state, rootState }, project) {
    await this.$axios.delete(
      `project/${project.id}/follow`,
      rootState.auth.headers
    )

    commit(
      'SET_FOLLOWS',
      state.follows.filter((x) => x.id !== project.id)
    )
  },
}
