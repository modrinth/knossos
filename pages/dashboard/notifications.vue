<template>
  <div>
    <section class="universal-card">
      <div class="header__row">
        <div class="header__title">
          <h2>Notifications</h2>
        </div>
        <div class="read-toggle-input">
          <label for="show-read-toggle">
            <span class="label__title">Show history</span>
          </label>
          <input
            id="show-read-toggle"
            v-model="showRead"
            class="switch stylized-toggle"
            type="checkbox"
          />
        </div>
      </div>
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
      <p v-else-if="error" class="known-errors">Failed to load notifications.</p>
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

const app = useNuxtApp()

const allNotifs = ref(await fetchNotifications())

const notifTypes = computed(() => {
  if (allNotifs.value === null) {
    return []
  }
  const types = [...new Set(allNotifs.value.map((notif) => notif.type))]
  return types.length > 1 ? ['all', ...types] : types
})
const notifications = computed(() => {
  if (allNotifs.value === null) {
    return []
  }
  const groupedNotifs = groupNotifications(allNotifs.value, showRead.value)
  return groupedNotifs.filter(
    (notif) => selectedType.value === 'all' || notif.type === selectedType.value
  )
})

const error = computed(() => allNotifs.value === null)
const history = computed(() => app.$route.params.type)

const selectedType = ref('all')
const showRead = ref(false)
</script>
<style lang="scss" scoped>
.read-toggle-input {
  display: flex;
  align-items: center;
  gap: var(--spacing-card-md);

  .label__title {
    margin: 0;
  }
}

.header__title {
  h2 {
    margin: 0 auto 0 0;
  }
}
</style>
