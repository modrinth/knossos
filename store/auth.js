export const state = () => ({
  token: null,
})

export const getters = {
  hasToken({ token }) {
    return token !== null && token !== undefined
  },
}

export const mutations = {
  setToken({ token }, newToken) {
    token = newToken
  },

  clearToken({ token }) {
    token = null
  },
}

export const actions = {}
