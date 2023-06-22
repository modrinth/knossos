<template>
  <div>
    <section class="universal-card">
      <h2>Notifications</h2>
      <template v-if="notifications.length > 0">
        <Chips
          v-model="selectedType"
          :items="notifTypes"
          :format-label="
            (x) => (x === 'all' ? 'All' : $formatProjectType(x).replace('_', ' ') + 's')
          "
          :capitalize="false"
        />
        <NotificationItem
          v-for="notification in notifications"
          :key="notification.id"
          v-model:notifications="allNotifs"
          class="universal-card recessed"
          :notification="notification"
          raised
        />
      </template>
      <p v-else>You don't have any unread notifications.</p>
    </section>
  </div>
</template>
<script setup>
import { fetchNotifications, groupNotifications } from '~/helpers/notifications.js'
import NotificationItem from '~/components/ui/NotificationItem.vue'
import Chips from '~/components/ui/Chips.vue'

useHead({
  title: 'Notifications - Modrinth',
})

const allNotifs = ref(await fetchNotifications())

const notifTypes = computed(() => {
  const types = [...new Set(allNotifs.value.map((notif) => notif.type))]
  return types.length > 1 ? ['all', ...types] : types
})
const notifications = computed(() => {
  const groupedNotifs = groupNotifications(allNotifs.value)
  return groupedNotifs.filter(
    (notif) => selectedType.value === 'all' || notif.type === selectedType.value
  )
})

const selectedType = ref('all')
</script>
<style lang="scss" scoped></style>
