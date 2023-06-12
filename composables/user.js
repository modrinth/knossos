export async function useUser(force = false) {
  const user = useState('user', () => {})

  if (!user.value || force || (user.value && Date.now() - user.value.lastUpdated > 300000))
    user.value = await initUser()

  return user
}

export async function initUser() {
  const auth = (await useAuth()).value

  const user = {
    notifications: [],
    follows: [],
    lastUpdated: 0,
  }

  if (auth.user && auth.user.id) {
    try {
      const [notifications, follows] = await Promise.all([
        useBaseFetch(`user/${auth.user.id}/notifications`, auth.headers),
        useBaseFetch(`user/${auth.user.id}/follows`, auth.headers),
      ])

      user.notifications = notifications
      user.follows = follows
      user.lastUpdated = Date.now()
    }
    catch (err) {
      console.error(err)
    }
  }

  return user
}

export async function initUserNotifs() {
  const auth = (await useAuth()).value
  const user = (await useUser()).value

  if (auth.user && auth.user.id) {
    try {
      user.notifications = await useBaseFetch(`user/${auth.user.id}/notifications`, auth.headers)
    }
    catch (err) {
      console.error(err)
    }
  }
}

export async function initUserFollows() {
  const auth = (await useAuth()).value
  const user = (await useUser()).value

  if (auth.user && auth.user.id) {
    try {
      user.follows = await useBaseFetch(`user/${auth.user.id}/follows`, auth.headers)
    }
    catch (err) {
      console.error(err)
    }
  }
}

export async function initUserProjects() {
  const auth = (await useAuth()).value
  const user = (await useUser()).value

  if (auth.user && auth.user.id) {
    try {
      user.projects = await useBaseFetch(`user/${auth.user.id}/projects`, auth.headers)
    }
    catch (err) {
      console.error(err)
    }
  }
}

export async function userFollowProject(project) {
  const auth = (await useAuth()).value
  const user = (await useUser()).value

  user.follows = user.follows.concat(project)
  project.followers++

  setTimeout(() => {
    useBaseFetch(`project/${project.id}/follow`, {
      method: 'POST',
      ...auth.headers,
    })
  })
}

export async function userUnfollowProject(project) {
  const auth = (await useAuth()).value
  const user = (await useUser()).value

  user.follows = user.follows.filter(x => x.id !== project.id)
  project.followers--

  setTimeout(() => {
    useBaseFetch(`project/${project.id}/follow`, {
      method: 'DELETE',
      ...auth.headers,
    })
  })
}

export async function userDeleteNotification(id) {
  const user = (await useUser()).value

  user.notifications = user.notifications.filter(x => x.id !== id)
}
