import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    notifications: [],
    follows: [],
    projects: [],
    lastUpdated: 0,
  }),
  actions: {
    async fetchAll(auth, force) {
      if (
        auth.user &&
        auth.user.id &&
        (force || Date.now() - this.lastUpdated > 300000)
      ) {
        try {
          const [notifications, follows, projects] = (
            await Promise.all([
              $fetch(`user/${auth.user.id}/notifications`, auth.headers),
              $fetch(`user/${auth.user.id}/follows`, auth.headers),
              $fetch(`user/${auth.user.id}/projects`, auth.headers),
            ])
          ).map((it) => it.data)

          this.notifications = notifications
          this.follows = follows
          this.projects = projects
          this.lastUpdated = Date.now()
        } catch (err) {
          console.error(err)
        }
      }
    },
    async fetchNotifications(auth) {
      if (auth.user && auth.user.id) {
        try {
          this.notifications = (
            await $fetch(
              `user/${auth.user.id}/notifications`,
              auth.headers
            )
          ).data
        } catch (err) {
          console.error(err)
        }
      }
    },
    async fetchFollows(auth) {
      if (auth.user && auth.user.id) {
        try {
          this.follows = (
            await $fetch(
              `user/${auth.user.id}/follows`,
              auth.headers
            )
          ).data
        } catch (err) {
          console.error(err)
        }
      }
    },
    async fetchProjects(auth) {
      if (auth.user && auth.user.id) {
        try {
          this.projects = (
            await $fetch(
              `user/${auth.user.id}/projects`,
              auth.headers
            )
          ).data
        } catch (err) {
          console.error(err)
        }
      }
    },
    followProject(project, auth) {
      this.follows = this.follows.concat(project)

      setTimeout(() => {
        this.$axios.post(
          `project/${project.id}/follow`,
          {},
          auth.headers
        )
      })
    },
    unfollowProject(project, auth) {
      this.follows = this.follows.filter((x) => x.id !== project.id)

      setTimeout(() => {
        this.$axios.delete(`project/${project.id}/follow`, auth.headers)
      })
    },
    deleteNotification(id) {
      this.notifications = this.notifications.filter((x) => x.id !== id)
    },
  },
})
