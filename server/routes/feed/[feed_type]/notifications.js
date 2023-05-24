import { Feed } from 'feed'
import { renderString } from '~/helpers/parse'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_URL = config.apiBaseUrl
  const WEBSITE_URL = config.public.siteUrl
  const authorization = getHeader(event, 'Authorization')

  if (authorization === undefined) {
    setResponseStatus(event, 401)
    return 'Please pass a valid authentication token to view your notifications as an RSS feed.'
  }

  try {
    const userInfo = await $fetch(API_URL + 'user', {
      headers: {
        Authorization: authorization,
      },
    })

    const userNotifications = await $fetch(API_URL + `user/${userInfo.id}/notifications`, {
      headers: {
        Authorization: authorization,
      },
    })

    const feed = new Feed({
      title: `Notifications for ${userInfo.username}`,
      link: WEBSITE_URL + '/notifications',
      generator: 'Modrinth',
      id: WEBSITE_URL + '/notifications',
      description: `${userInfo.username} has ${userNotifications.length} notification${
        userNotifications.length === 1 ? '' : 's'
      }`,
      feedLinks: {
        json: WEBSITE_URL + '/feed/json/notifications',
        atom: WEBSITE_URL + '/feed/atom/notifications',
        rss: WEBSITE_URL + '/feed/rss/notifications',
      },
    })

    userNotifications.forEach((notification) => {
      feed.addItem({
        title: notification.title,
        description: renderString(notification.text),
        id: WEBSITE_URL + notification.link,
        link: WEBSITE_URL + notification.link,
        date: new Date(notification.created),
        author: [
          {
            name: userInfo.username,
            link: WEBSITE_URL + `/user/${userInfo.id}`,
          },
        ],
      })
    })

    switch (event.context.params.feed_type.toLowerCase()) {
      case 'rss':
        setResponseHeader(event, 'Content-Type', 'application/rss+xml')
        return feed.rss2()
      case 'atom':
        setResponseHeader(event, 'Content-Type', 'application/atom+xml')
        return feed.atom1()
      case 'json':
        setResponseHeader(event, 'Content-Type', 'application/feed+json')
        return feed.json1()
      default:
        setResponseStatus(event, 500)
        return 'Invalid Feed Type'
    }
  } catch (e) {
    setResponseStatus(event, 401)
    return 'There was an error generating the feed.\n\n' + e
  }
})
