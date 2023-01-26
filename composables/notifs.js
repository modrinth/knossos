export const useNotifications = () => useState('notifications', () => [])

export const addNotification = (notification) => {
  const notifications = useNotifications()

  notifications.value.push(notification)
}
