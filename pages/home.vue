<template>
  <div class="normal-page">
    <div class="normal-page__header">
      <h1>Home</h1>
    </div>
    <div class="normal-page__sidebar">
      <section class="universal-card">
        <div class="user-info">
          <Avatar :src="auth.user.avatar_url" circle size="xs" />
          <h2 class="sidebar-card-header">{{ auth.user.username }}</h2>
        </div>
        <div class="primary-stat">
          <BoxIcon class="primary-stat__icon" aria-hidden="true" />
          <div class="primary-stat__text">
            <span class="primary-stat__counter">
              {{ $formatNumber(projects.length) }}
            </span>
            project<span v-if="projects.length !== 1">s</span>
          </div>
        </div>
        <div class="primary-stat">
          <DownloadIcon class="primary-stat__icon" aria-hidden="true" />
          <div class="primary-stat__text">
            <span class="primary-stat__counter">
              {{ $formatNumber(sumDownloads) }}
            </span>
            download<span v-if="sumDownloads !== 1">s</span>
          </div>
        </div>
        <div class="primary-stat">
          <HeartIcon class="primary-stat__icon" aria-hidden="true" />
          <div class="primary-stat__text">
            <span class="primary-stat__counter">
              {{ $formatNumber(sumFollows) }}
            </span>
            follower<span v-if="sumFollows !== 1">s</span>
          </div>
        </div>
        <nuxt-link class="goto-link" :to="`/user/${auth.user.username}`">
          <SettingsIcon /> Edit profile <ChevronRightIcon />
        </nuxt-link>
      </section>
      <section class="universal-card">
        <h2 class="sidebar-card-header">Rewards</h2>
        <p>Showing your current rewards amount.</p>
        <button class="btn rewards-display">
          {{ $formatMoney(auth.user.payout_data.balance, true) }}
        </button>
        <nuxt-link class="goto-link" to="/revenue">
          <BanknoteIcon /> Withdraw rewards <ChevronRightIcon />
        </nuxt-link>
        <nuxt-link class="goto-link" to="/revenue/transfers">
          <TransferIcon />View transfer history <ChevronRightIcon />
        </nuxt-link>
      </section>
      <section class="universal-card">
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
        <nuxt-link class="goto-link" to="/revenue/transfers">
          <ListIcon />View all projects <ChevronRightIcon />
        </nuxt-link>
      </section>
    </div>
    <div class="normal-page__content">
      <template v-if="notifications.length > 0">
        <NotificationItem
          v-for="notification in notifications"
          :key="notification.id"
          v-model:notifications="allNotifs"
          class="universal-card"
          :notification="notification"
          :auth="auth"
          compact
        />
      </template>
      <div v-else class="universal-body">
        <p>You have no unread notifications.</p>
        <nuxt-link class="iconified-button" to="/notifications">
          <HistoryIcon /> View notification history
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DownloadIcon, HeartIcon, BoxIcon, SettingsIcon } from 'omorphia'
import ChartIcon from '~/assets/images/utils/chart.svg'
import ListIcon from '~/assets/images/utils/list.svg'
import TransferIcon from '~/assets/images/utils/transfer.svg'
import BanknoteIcon from '~/assets/images/utils/banknote.svg'
import ChevronRightIcon from '~/assets/images/utils/chevron-right.svg'
import HistoryIcon from '~/assets/images/utils/history.svg'
import Avatar from '~/components/ui/Avatar.vue'
import NotificationItem from '~/components/ui/NotificationItem.vue'
import { fetchNotifications, groupNotifications } from '~/helpers/notifications.js'

const auth = await useAuth()

const [{ data: projects }, { data: payouts }] = await Promise.all([
  useAsyncData(`user/${auth.value.user.id}/projects`, () =>
    useBaseFetch(`user/${auth.value.user.id}/projects`)
  ),
  useAsyncData(`user/${auth.value.user.id}/payouts`, () =>
    useBaseFetch(`user/${auth.value.user.id}/payouts`)
  ),
])

const allNotifs = groupNotifications(await fetchNotifications())

const notifications = computed(() => allNotifs.slice(0, 3))

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
</script>
<style lang="scss" scoped>
.normal-page__header {
  display: flex;
  align-items: flex-start;
  gap: var(--gap-lg);
  --_avatar-size: 6rem;
  margin-bottom: var(--gap-lg);

  .user-avatar {
    width: var(--_avatar-size);
    height: var(--_avatar-size);
  }

  .user-info {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);

    .user-info__title {
      display: flex;
      gap: var(--gap-sm);
      align-items: center;

      h1 {
        font-size: var(--font-size-xl);
        margin: 0;
      }
    }

    .user-info__bio {
      margin: 0;
      max-width: 50rem;
    }
  }
}

.rewards-display {
  width: 100%;
  font-size: 1.75rem;
  justify-content: center;
  padding: var(--gap-lg);
  border: 1px solid var(--color-button-bg);
  background-color: var(--color-bg);
  color: var(--color-text);
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
  gap: var(--gap-lg);
  align-items: center;
  margin-bottom: var(--gap-md);
}
</style>
