export default () => {
  const auth = useState<any>('auth', () => ({
    user: null,
    token: '',
    headers: {},
  }))

  const authCookie = useCookie<any>('auth-token', {
    maxAge: 60 * 60 * 24 * 365 * 10,
    sameSite: 'lax',
    secure: true,
    httpOnly: false,
    path: '/',
  })

  const initAuth = async () => {
    if (auth.value.user || !authCookie.value)
      return

    const oldToken = authCookie.value

    const newAuth = {
      user: null,
      token: '',
      headers: {},
    } as any
    const route = useRoute()

    if (oldToken)
      authCookie.value = oldToken

    if (route.query.code)
      authCookie.value = route.query.code

    if (authCookie.value) {
      newAuth.token = authCookie.value
      try {
        newAuth.user = await useBaseFetch('user', {
          headers: {
            Authorization: newAuth.token,
          },
        })
      }
      catch {}

      newAuth.headers = {
        headers: {
          Authorization: newAuth.token,
        },
      }
    }

    auth.value = newAuth
  }

  // (async () => {
  //   console.log(!auth.value.user || authCookie.value)

  //   // if (!auth.value.user || authCookie.value)
  //   // auth.value = await initAuth(authCookie.value)
  // })()

  return {
    user: auth.value.user,
    token: auth.value.token,
    headers: auth.value.headers,
    initAuth,
  }
}
