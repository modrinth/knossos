import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, token: '', headers: {} }),
  actions: {
    async fetchUser(token) {
      try {
        const user = (
          await $fetch(`user`, {
            headers: {
              Authorization: token,
              'x-ratelimit-key': process.server
                ? process.env.RATE_LIMIT_IGNORE_KEY || ''
                : '',
            },
          })
        ).data

        if (user.payout_data && user.payout_data.balance) {
          user.payout_data.balance =
            Math.floor(user.payout_data.balance * 100) / 100
        }

        this.user = user
        this.token = token
        this.headers = {
          headers: {
            Authorization: token,
          },
        }
      } catch (e) {
        console.error('Request for user info encountered an error: ', e)
      }
    },
  },
})
