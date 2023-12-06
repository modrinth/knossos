import { getProjectTypeForUrl } from '~/helpers/projects.js'

async function getBulk(type, ids) {
  if (ids.length === 0) {
    return []
  }

  const url = `${type}?ids=${encodeURIComponent(JSON.stringify([...new Set(ids)]))}`
  const { data: bulkFetch } = await useAsyncData(url, () => useBaseFetch(url))
  return bulkFetch.value
}

export async function fetchNotifications() {
  try {
    const auth = (await useAuth()).value
    const { data: notifications } = await useAsyncData(`user/${auth.user.id}/notifications`, () =>
      useBaseFetch(`user/${auth.user.id}/notifications`)
    )

    const projectIds = []
    const reportIds = []
    const threadIds = []
    const userIds = []
    const versionIds = []

    for (const notification of notifications.value) {
      if (notification.body) {
        if (notification.body.project_id) {
          projectIds.push(notification.body.project_id)
        }
        if (notification.body.version_id) {
          versionIds.push(notification.body.version_id)
        }
        if (notification.body.report_id) {
          reportIds.push(notification.body.report_id)
        }
        if (notification.body.thread_id) {
          threadIds.push(notification.body.thread_id)
        }
        if (notification.body.invited_by) {
          userIds.push(notification.body.invited_by)
        }
      }
    }

    const reports = await getBulk('reports', reportIds)

    for (const report of reports) {
      if (report.item_type === 'project') {
        projectIds.push(report.item_id)
      } else if (report.item_type === 'user') {
        userIds.push(report.item_id)
      } else if (report.item_type === 'version') {
        versionIds.push(report.item_id)
      }
    }

    const versions = await getBulk('versions', versionIds)

    for (const version of versions) {
      projectIds.push(version.project_id)
    }

    const projects = await getBulk('projects', projectIds)
    const threads = await getBulk('threads', threadIds)
    const users = await getBulk('users', userIds)

    for (const notification of notifications.value) {
      notification.extra_data = {}
      if (notification.body) {
        if (notification.body.project_id) {
          notification.extra_data.project = projects.find(
            (x) => x.id === notification.body.project_id
          )
        }
        if (notification.body.report_id) {
          notification.extra_data.report = reports.find((x) => x.id === notification.body.report_id)

          const type = notification.extra_data.report.item_type
          if (type === 'project') {
            notification.extra_data.project = projects.find(
              (x) => x.id === notification.extra_data.report.item_id
            )
          } else if (type === 'user') {
            notification.extra_data.user = users.find(
              (x) => x.id === notification.extra_data.report.item_id
            )
          } else if (type === 'version') {
            notification.extra_data.version = versions.find(
              (x) => x.id === notification.extra_data.report.item_id
            )
            const project = projects.find(
              (x) => x.id === notification.extra_data.version.project_id
            )
            project.project_type = getProjectTypeForUrl(project.project_type, project.categories)
            notification.extra_data.project = project
          }
        }
        if (notification.body.thread_id) {
          notification.extra_data.thread = threads.find((x) => x.id === notification.body.thread_id)
        }
        if (notification.body.invited_by) {
          notification.extra_data.invited_by = users.find(
            (x) => x.id === notification.body.invited_by
          )
        }
        if (notification.body.version_id) {
          notification.extra_data.version = versions.find(
            (x) => x.id === notification.body.version_id
          )
        }
      }
    }

    return notifications.value
  } catch (error) {
    addNotification({
      group: 'main',
      title: 'Error loading notifications',
      text: error.data ? error.data.description : error,
      type: 'error',
    })
  }
  return []
}

export function groupNotifications(notifications, includeRead = false) {
  const grouped = []

  let lastNotification = null

  for (const notification of notifications.filter((notif) => includeRead || !notif.read)) {
    if (
      lastNotification &&
      ((lastNotification.body.thread_id === notification.body.thread_id &&
        !!lastNotification.body.thread_id) ||
        (lastNotification.body.project_id === notification.body.project_id &&
          !!lastNotification.body.project_id)) &&
      lastNotification.read === notification.read
    ) {
      lastNotification.grouped_notifs.push(notification)
    } else {
      notification.grouped_notifs = [notification]
      grouped.push(notification)
      lastNotification = notification
    }
  }

  return grouped
}

export async function markAsRead(ids) {
  try {
    await useBaseFetch(`notifications?ids=${JSON.stringify([...new Set(ids)])}`, {
      method: 'PATCH',
    })
    return (notifications) => {
      const newNotifs = notifications
      newNotifs.forEach((notif) => {
        if (ids.includes(notif.id)) {
          notif.read = true
        }
      })
      return newNotifs
    }
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'Error marking notification as read',
      text: err.data ? err.data.description : err,
      type: 'error',
    })
    return () => {}
  }
}
