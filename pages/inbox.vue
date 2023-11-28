<template>
  <div class="normal-page small-header">
    <div class="normal-page__header">
      <Breadcrumbs
        v-if="history"
        current-title="History"
        :link-stack="[{ href: `/inbox`, label: 'Inbox' }]"
      />
      <h1 v-if="history">Inbox history</h1>
      <div v-else class="inbox-page-heading">
        <h1>Inbox</h1>
        <div class="actions">
          <Button v-if="allNotifs && allNotifs.some((notif) => notif.read)" @click="updateRoute()">
            <HistoryIcon /> View history
          </Button>
        </div>
      </div>
    </div>
    <div class="normal-page__sidebar">
      <div class="universal-card">
        <h2>Filter</h2>
        <button
          v-for="type in notifTypes"
          :key="type"
          class="radio-button button-base"
          :class="{ selected: selectedType == type }"
          @click="selectedType = type"
        >
          <RadioButtonCheckedIcon v-if="selectedType === type" />
          <RadioButtonIcon v-else />
          {{ type === 'all' ? 'All' : $formatProjectType(type).replace('_', ' ') + 's' }}
        </button>
        <Button
          v-if="notifications.length > 0"
          color="danger"
          outline
          class="clear-all-button"
          @click="readAll()"
        >
          <CheckCheckIcon /> Mark all as read
        </Button>
      </div>
    </div>
    <div class="normal-page__content">
      <template v-if="notifications.length > 0">
        <Chips
          v-if="notifTypes.length > 1"
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
          class="universal-card"
          :notification="notification"
          :auth="auth"
        />
      </template>
      <p v-else>You don't have any unread notifications.</p>
    </div>
  </div>
</template>
<script setup>
import { Button, HistoryIcon } from 'omorphia'
import NotificationItem from '~/components/ui/NotificationItem.vue'
import Chips from '~/components/ui/Chips.vue'
import CheckCheckIcon from '~/assets/images/utils/check-check.svg'
import Breadcrumbs from '~/components/ui/Breadcrumbs.vue'
import RadioButtonCheckedIcon from 'assets/images/utils/radio-button-checked.svg'
import RadioButtonIcon from 'assets/images/utils/radio-button.svg'

useHead({
  title: 'Inbox - Modrinth',
})

const auth = await useAuth()

const route = useRoute()
const router = useRouter()

const history = computed(() => {
  return route.name === 'notifications-history'
})

const allNotifs = ref(null)

const filteredTypes = ['project_update']

const notifTypes = computed(() => {
  if (allNotifs.value === null) {
    return []
  }
  const types = [
    ...new Set(
      allNotifs.value
        .filter((notification) => {
          return history.value || !notification.read
        })
        .map((notif) => notif.type)
    ),
  ].filter((type) => !filteredTypes.includes(type))
  return types.length > 1 ? ['all', ...types] : types
})

const notifications = computed(() => {
  if (allNotifs.value === null) {
    return []
  }
  const groupedNotifs = groupNotifications(allNotifs.value, history.value)
  return groupedNotifs.filter(
    (notif) =>
      (selectedType.value === 'all' || notif.type === selectedType.value) &&
      !filteredTypes.includes(notif.type)
  )
})

const selectedType = ref('all')

await fetchNotifications().then((result) => {
  allNotifs.value = result
  selectedType.value = notifTypes.value[0]
})

function updateRoute() {
  if (history.value) {
    router.push('/inbox')
  } else {
    router.push('/inbox/history')
  }
}

async function readAll() {
  const ids = inbox.value.flatMap((notification) => [
    notification.id,
    ...(notification.grouped_notifs ? notification.grouped_notifs.map((notif) => notif.id) : []),
  ])

  const updateNotifs = await markAsRead(ids)
  allNotifs.value = updateNotifs(allNotifs.value)
}
</script>
<style lang="scss" scoped>
h1 {
  margin-block: var(--gap-sm) var(--gap-lg);
  font-size: 2em;
  line-height: 1em;
}

.radio-button {
  display: flex;
  background-color: transparent;
  align-items: center;
  width: fit-content;
  padding-block: var(--gap-sm);
  color: var(--color-text);

  svg {
    margin-right: var(--gap-sm);
    width: 1.1rem;
    height: 1.1rem;
  }

  &.selected {
    color: var(--color-text-dark);

    svg {
      color: var(--color-brand);
    }
  }
}

.inbox-page-heading {
  display: flex;
  align-items: center;

  h1 {
    margin-right: auto;
  }

  .actions {
    display: flex;
    gap: var(--gap-sm);
  }
}

.clear-all-button {
  margin-top: var(--gap-md);
}
</style>
