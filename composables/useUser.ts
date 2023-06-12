export default () => {
  const userState = useState<any>('user', () => {})
  const { user, headers } = useAuth()

  const initUser = async () => {
    const user = {
      notifications: [],
      follows: [],
      lastUpdated: 0,
    } as any

    if (user && user.id) {
      try {
        const [notifications, follows] = await Promise.all([
          useBaseFetch(`user/${user.id}/notifications`, headers),
          useBaseFetch(`user/${user.id}/follows`, headers),
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

  const initUserNotifs = async () => {
    if (user && user.id) {
      try {
        userState.value.notifications = await useBaseFetch(`user/${user.id}/notifications`, headers)
      }
      catch (err) {
        console.error(err)
      }
    }
  }

  const initUserFollows = async () => {
    if (user && user.id) {
      try {
        userState.value.follows = await useBaseFetch(`user/${user.id}/follows`, headers)
      }
      catch (err) {
        console.error(err)
      }
    }
  }

  const initUserProjects = async () => {
    if (user && user.id) {
      try {
        userState.value.projects = await useBaseFetch(`user/${user.id}/projects`, headers)
      }
      catch (err) {
        console.error(err)
      }
    }
  }

  const userFollowProject = async (project: any) => {
    userState.value.follows = userState.value.follows.concat(project)
    project.followers++

    setTimeout(() => {
      useBaseFetch(`project/${project.id}/follow`, {
        method: 'POST',
        ...headers,
      })
    })
  }

  const userUnfollowProject = async (project: any) => {
    userState.value.follows = userState.value.follows.filter((follow: any) => follow.id !== project.id)
    project.followers--

    setTimeout(() => {
      useBaseFetch(`project/${project.id}/follow`, {
        method: 'DELETE',
        ...headers,
      })
    })
  }

  const userDeleteNotification = async (id: string) => {
    userState.value.notifications = userState.value.notifications.filter((x: any) => x.id !== id)
  }

  (async () => {
    if (!userState.value || (userState.value && Date.now() - userState.value.lastUpdated > 300000))
      userState.value = await initUser()
  })()

  return {
    user: userState.value,
    initUser,
    initUserNotifs,
    initUserFollows,
    initUserProjects,
    userFollowProject,
    userUnfollowProject,
    userDeleteNotification,
  }
}
