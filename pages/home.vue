<template>
  <div class="normal-page">
    <div class="normal-page__header">
      <h1>Home</h1>
    </div>
    <div class="normal-page__sidebar">
      <section class="card">
        <nuxt-link :to="getUserLink(auth.user)" class="user-info">
          <Avatar :src="auth.user.avatar_url" circle size="xs" />
          <h2 class="sidebar-card-header">{{ auth.user.username }}</h2>
        </nuxt-link>
        <template v-if="projects.length > 0">
          <div class="primary-stat">
            <BoxIcon class="primary-stat__icon" aria-hidden="true" />
            <div class="primary-stat__text">
              <span class="primary-stat__counter">
                {{ formatNumber(projects.length) }}
              </span>
              project<span v-if="projects.length !== 1">s</span>
            </div>
          </div>
          <div class="primary-stat">
            <DownloadIcon class="primary-stat__icon" aria-hidden="true" />
            <div class="primary-stat__text">
              <span class="primary-stat__counter">
                {{ formatNumber(sumDownloads) }}
              </span>
              project download<span v-if="sumDownloads !== 1">s</span>
            </div>
          </div>
          <div class="primary-stat">
            <HeartIcon class="primary-stat__icon" aria-hidden="true" />
            <div class="primary-stat__text">
              <span class="primary-stat__counter">
                {{ formatNumber(sumFollows) }}
              </span>
              project follower<span v-if="sumFollows !== 1">s</span>
            </div>
          </div>
        </template>
        <nuxt-link class="goto-link" :to="`/user/${auth.user.username}`">
          <UserIcon /> View profile <ChevronRightIcon />
        </nuxt-link>
        <nuxt-link class="goto-link" :to="`/settings/profile`">
          <SettingsIcon /> Edit profile <ChevronRightIcon />
        </nuxt-link>
      </section>
      <section class="card">
        <h2 class="sidebar-card-header">Rewards</h2>
        <p>Showing your current rewards amount.</p>
        <button class="btn rewards-display">
          {{ formatMoney(auth.user.payout_data.balance, true) }}
        </button>
        <nuxt-link class="goto-link" to="/settings/revenue">
          <BanknoteIcon /> Withdraw rewards <ChevronRightIcon />
        </nuxt-link>
        <nuxt-link class="goto-link" to="/settings/revenue/transfers">
          <TransferIcon />View transfer history <ChevronRightIcon />
        </nuxt-link>
      </section>
      <section class="card">
        <h2 class="sidebar-card-header">Your projects</h2>
        <p>Showing downloads this week compared to last week.</p>
        <div class="mini-project-table">
          <div
            v-for="(project, index) in projectsPreview"
            :key="project.id"
            class="mini-project-row"
          >
            <div class="index">{{ index + 1 }}.</div>
            <div class="project-icon">
              <Avatar :src="project.icon_url" size="xxs" />
            </div>
            <div class="project-name">
              {{ project.title }}
            </div>
            <div class="project-change positive">+0.24%</div>
          </div>
        </div>
        <nuxt-link class="goto-link" to="/analytics">
          <ChartIcon />View more analytics <ChevronRightIcon />
        </nuxt-link>
        <nuxt-link class="goto-link" to="/creations/projects">
          <ListIcon />View all projects <ChevronRightIcon />
        </nuxt-link>
      </section>
    </div>
    <div class="normal-page__content">
      <div class="search-row">
        <div class="iconified-input">
          <label for="search-input" hidden>Search notifications</label>
          <SearchIcon />
          <input id="search-input" v-model="notificationSearchInput" type="text" />
          <Button
            :class="notificationSearchInput ? '' : 'empty'"
            @click="() => (notificationSearchInput = '')"
          >
            <XIcon />
          </Button>
        </div>
        <PopoutMenu class="btn search-row-button">
          <FilterIcon />
          Filter...
          <template #menu>
            <h2 class="popout-heading">Type</h2>
            <Checkbox
              v-for="option in filterOptions"
              :key="`option-${option}`"
              class="popout-checkbox"
              :model-value="selectedFilters.includes(option)"
              @click="
                () => {
                  if (selectedFilters.includes(option)) {
                    selectedFilters = selectedFilters.filter((f) => f !== option)
                  } else {
                    selectedFilters.push(option)
                  }
                }
              "
            >
              {{ option }}
            </Checkbox>
          </template>
        </PopoutMenu>
      </div>
      <template v-if="notifications.length > 0">
        <NotificationItem
          v-for="notification in notifications"
          :key="notification.id"
          v-model:notifications="allNotifs"
          class="card"
          :notification="notification"
          :auth="auth"
        />
      </template>
      <div v-else class="universal-body">
        <p>You have no unread notifications.</p>
        <nuxt-link class="btn" to="/notifications">
          <HistoryIcon /> View notification history
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  DownloadIcon,
  UserIcon,
  HeartIcon,
  BoxIcon,
  SettingsIcon,
  Button,
  XIcon,
  PopoutMenu,
  ListIcon,
  ChartIcon,
  TransferIcon,
  ChevronRightIcon,
  HistoryIcon,
  Avatar,
  SearchIcon,
  FilterIcon,
  getUserLink,
  Checkbox,
  formatNumber,
  formatMoney,
} from 'omorphia'
import BanknoteIcon from '~/assets/images/utils/banknote.svg'
import NotificationItem from '~/components/ui/NotificationItem.vue'

definePageMeta({
  middleware: 'auth',
})

const auth = await useAuth()

const { data: projects } = await useAsyncData(`user/${auth.value.user.id}/projects`, () =>
  useBaseFetch(`user/${auth.value.user.id}/projects`)
)

const allNotifs = groupNotifications(await fetchNotifications(), true)

const notifications = computed(() =>
  allNotifs.filter((notif) => {
    if (selectedFilters.value.length > 0 && !selectedFilters.value.includes(notif.type)) {
      return false
    }

    const query = notificationSearchInput.value.toLowerCase()

    if (notificationSearchInput.value) {
      if (notif.extra_data.project) {
        return notif.extra_data.project.title.toLowerCase().includes(query)
      } else {
        return notif.title.toLowerCase().includes(query)
      }
    }
    return true
  })
)

const filterOptions = computed(() => [...new Set(notifications.value.map((notif) => notif.type))])
const selectedFilters = ref([])

const projectsPreview = computed(() => projects.value.slice(0, 10))

const sumDownloads = computed(() => {
  let sum = 0

  for (const project of projects.value) {
    sum += project.downloads
  }

  return sum
})
const sumFollows = computed(() => {
  let sum = 0

  for (const project of projects.value) {
    sum += project.followers
  }

  return sum
})

const notificationSearchInput = ref('')
</script>
<style lang="scss" scoped>
.normal-page__header {
  display: flex;
  align-items: flex-start;
  gap: var(--gap-lg);
  --_avatar-size: 6rem;
  margin-bottom: var(--gap-lg);
}

.rewards-display {
  width: 100%;
  font-size: 1.75rem;
  justify-content: center;
  padding: var(--gap-lg);
  border: 1px solid var(--color-divider);
  background-color: var(--color-bg);
  color: var(--color-base);
  margin-block: var(--gap-lg);
}

.mini-project-table {
  display: flex;
  flex-direction: column;
  display: grid;
  gap: var(--gap-sm);
  border-radius: var(--radius-sm);

  .mini-project-row {
    display: grid;
    gap: var(--gap-xs);
    grid-template-columns: 1.5rem min-content auto 5rem;

    &:not(:last-child) {
      border-bottom: 1px solid var(--color-button-bg);
    }

    .project-icon {
      .avatar {
        border-radius: 5px;
      }
    }

    .project-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .project-change {
      text-align: right;

      &.positive {
        color: var(--color-green);
      }

      &.negative {
        color: var(--color-red);
      }

      &.neutral {
        color: var(--color-gray);
      }
    }
  }
}

.normal-page__sidebar {
  .goto-link {
    gap: 0;
    margin-top: var(--gap-md);

    svg:first-child {
      margin-right: 0.5rem;
    }

    svg:last-child {
      margin-left: 3px;
    }
  }
}

.normal-page__header {
  margin-bottom: 0;
}

.user-info {
  display: flex;
  gap: var(--gap-md);
  align-items: center;
  margin-bottom: var(--gap-md);

  h2 {
    margin: 0;
  }
}

.iconified-input {
  .empty {
    visibility: hidden;
  }
}

.popout-heading {
  padding: var(--gap-sm) var(--gap-md);
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--color-base);
}

.popout-checkbox {
  padding: var(--gap-sm) var(--gap-md);
}
</style>
