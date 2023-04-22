<template>
  <div class="dashboard-overview">
    <section class="universal-card dashboard-header">
      <Avatar :src="$auth.user.avatar_url" size="md" circle :alt="$auth.user.username" />
      <div class="username">
        <h1>
          {{ $auth.user.username }}
        </h1>
        <NuxtLink class="goto-link" :to="`/user/${$auth.user.username}`">
          Visit your profile
          <ChevronRightIcon class="featured-header-chevron" aria-hidden="true" />
        </NuxtLink>
      </div>
    </section>
    <!-- Notification system is too awful for this to work -->
    <!--    <section class="universal-card dashboard-notifications">-->
    <!--      <h2>Notifications</h2>-->
    <!--      <div-->
    <!--        v-for="notification in user.notifications.slice(0,4)"-->
    <!--        :key="notification.id"-->
    <!--        class="dark-card notification"-->
    <!--      >-->
    <!--        <div class="label">-->
    <!--          <span class="label__title">-->
    <!--            <nuxt-link :to="notification.link">-->
    <!--              <h3 v-html="renderString(notification.title)" />-->
    <!--            </nuxt-link>-->
    <!--          </span>-->
    <!--          <div class="label__description">-->
    <!--            <p>{{ notification.text }}</p>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </section>-->
    <section class="universal-card dashboard-analytics">
      <h2>Analytics</h2>
      <div class="grid-display">
        <div class="grid-display__item">
          <div class="label">Total downloads</div>
          <div class="value">
            {{ $formatNumber(projects.reduce((agg, x) => agg + x.downloads, 0)) }}
          </div>
          <span
            >from
            {{ downloadsProjectCount }}
            project{{ downloadsProjectCount === 1 ? '' : 's' }}</span
          >
          <!--          <NuxtLink class="goto-link" to="/dashboard/analytics"-->
          <!--            >View breakdown-->
          <!--            <ChevronRightIcon-->
          <!--              class="featured-header-chevron"-->
          <!--              aria-hidden="true"-->
          <!--          /></NuxtLink>-->
        </div>
        <div class="grid-display__item">
          <div class="label">Total followers</div>
          <div class="value">
            {{ $formatNumber(projects.reduce((agg, x) => agg + x.followers, 0)) }}
          </div>
          <span>
            <span
              >from {{ followersProjectCount }} project{{
                followersProjectCount === 1 ? '' : 's'
              }}</span
            ></span
          >
        </div>
        <div class="grid-display__item">
          <div class="label">Total revenue</div>
          <div class="value">
            {{ $formatMoney(payouts.all_time, true) }}
          </div>
          <span>{{ $formatMoney(payouts.last_month, true) }} in the last month</span>
        </div>
        <div class="grid-display__item">
          <div class="label">Current balance</div>
          <div class="value">
            {{ $formatMoney(auth.user.payout_data.balance, true) }}
          </div>
          <NuxtLink
            v-if="auth.user.payout_data.balance >= minWithdraw"
            class="goto-link"
            to="/dashboard/revenue"
          >
            Withdraw earnings
            <ChevronRightIcon class="featured-header-chevron" aria-hidden="true" />
          </NuxtLink>
          <span v-else>${{ minWithdraw }} is the withdraw minimum</span>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup>
import ChevronRightIcon from '~/assets/images/utils/chevron-right.svg'
import Avatar from '~/components/ui/Avatar.vue'

useHead({
  title: 'Dashboard - Modrinth',
})

const auth = await useAuth()
const app = useNuxtApp()

const [rawProjects, rawPayouts] = await Promise.all([
  useBaseFetch(`user/${auth.value.user.id}/projects`, app.$defaultHeaders()),
  useBaseFetch(`user/${auth.value.user.id}/payouts`, app.$defaultHeaders()),
])

const projects = shallowRef(rawProjects)
const payouts = ref(rawPayouts)
const minWithdraw = ref(0.26)

const downloadsProjectCount = computed(
  () => projects.value.filter((project) => project.downloads > 0).length
)
const followersProjectCount = computed(
  () => projects.value.filter((project) => project.followers > 0).length
)
</script>
<style lang="scss">
.dashboard-overview {
  display: grid;
  grid-template:
    'header header'
    'notifications analytics' / 1fr 1fr;
  gap: var(--spacing-card-md);

  > .universal-card {
    margin: 0;
  }
}

.dashboard-notifications {
  grid-area: notifications;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-card-md);

  .notification {
    .label__title,
    h1,
    h2,
    h3,
    h4,
    p {
      margin: 0 !important;
    }
  }
}

.dashboard-analytics {
  grid-area: analytics;
}

.dashboard-header {
  display: flex;
  gap: var(--spacing-card-bg);
  grid-area: header;

  .username {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-card-sm);
    justify-content: center;

    h1 {
      margin: 0;
    }
  }
}
</style>
