export const useAuth = async () => {
  const auth = useState('auth', () => {})

  if (!auth.value) {
    auth.value = await initAuth()
  }

  return auth
}

export const initAuth = async (oldToken = null) => {
  const auth = {
    user: null,
    token: '',
    headers: {},
  }
  const route = useRoute()
  const authCookie = useCookie('auth-token', {
    secure: true,
    sameSite: 'Strict',
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    path: '/',
  })

  if (oldToken) {
    authCookie.value = oldToken
  }

  if (route.query.code) {
    authCookie.value = route.query.code
  }

  if (authCookie.value) {
    auth.token = authCookie.value
    try {
      auth.user = await useBaseFetch('user', {
        headers: {
          Authorization: auth.token,
          // TODO: add back ratelimit key
        },
      })
    } catch {}

    auth.headers = {
      headers: {
        Authorization: auth.token,
      },
    }
  }

  return auth
}
