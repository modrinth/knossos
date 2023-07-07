const getBulk = async (type, ids) => {
  const auth = (await useAuth()).value
  if (ids.length === 0) {
    return []
  }
  return await useBaseFetch(`${type}?ids=${JSON.stringify([...new Set(ids)])}`, auth.headers)
}

export const fetchNotifications = async () => {
  const auth = (await useAuth()).value
  const notifications = await useBaseFetch(`user/${auth.user.id}/notifications`, auth.headers)

  const projectIds = []
  const reportIds = []
  const threadIds = []
  const userIds = []
  const versionIds = []

  for (const notification of notifications) {
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

  for (const notification of notifications) {
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
          notification.extra_data.project = projects.find(
            (x) => x.id === notification.extra_data.version.project_id
          )
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

  return notifications
}

export const groupNotifications = (notifications, includeRead = false) => {
  const grouped = []
  for (const notification of notifications.filter((notif) => includeRead || !notif.read)) {
    // Group notifications of the same thread or project id
    if (notification.body) {
      const index = grouped.findIndex(
        (notif) =>
          (notif.body.thread_id === notification.body.thread_id ||
            notif.body.project_id === notification.body.project_id) &&
          notification.read === notif.read
      )
      const notif = grouped[index]
      if (
        notif &&
        (notification.body.type === 'moderator_message' ||
          notification.body.type === 'project_update')
      ) {
        let groupedNotifs = notif.grouped_notifs
        if (!groupedNotifs) {
          groupedNotifs = []
        }
        groupedNotifs.push(notification)
        grouped[index].grouped_notifs = groupedNotifs
      } else {
        grouped.push(notification)
      }
    } else {
      grouped.push(notification)
    }
  }

  return grouped
}
