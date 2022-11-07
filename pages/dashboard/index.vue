<template>
  <div>
    <section class="card">
      <h2 class="title">Overview</h2>
      <div class="metrics">
        <div class="metric">
          <div class="label">Total downloads</div>
          <div class="value">{{ $formatNumber(totalDownloads) }}</div>
          <span>{{ $formatNumber(monthDownloads) }} this month</span>
          <!--          <NuxtLink class="goto-link" to="/dashboard/analytics"-->
          <!--            >View breakdown-->
          <!--            <ChevronRightIcon-->
          <!--              class="featured-header-chevron"-->
          <!--              aria-hidden="true"-->
          <!--          /></NuxtLink>-->
        </div>
        <div class="metric">
          <div class="label">Total impressions</div>
          <div class="value">{{ $formatNumber(totalImpressions) }}</div>
          <span>{{ $formatNumber(monthImpressions) }} this month</span>
          <!--          <NuxtLink class="goto-link" to="/dashboard/analytics"-->
          <!--            >View breakdown-->
          <!--            <ChevronRightIcon-->
          <!--              class="featured-header-chevron"-->
          <!--              aria-hidden="true"-->
          <!--          /></NuxtLink>-->
        </div>
        <div class="metric">
          <div class="label">Total revenue</div>
          <div class="value">${{ $formatNumber(totalRevenue) }}</div>
          <span>${{ $formatNumber(monthRevenue) }} this month</span>
          <!--          <NuxtLink class="goto-link" to="/dashboard/analytics"-->
          <!--            >View breakdown-->
          <!--            <ChevronRightIcon-->
          <!--              class="featured-header-chevron"-->
          <!--              aria-hidden="true"-->
          <!--          /></NuxtLink>-->
        </div>
        <div class="metric">
          <div class="label">Current balance</div>
          <div class="value">${{ $formatNumber(currentBalance) }}</div>
          <NuxtLink
            v-if="currentBalance >= 5"
            class="goto-link"
            to="/dashboard/revenue"
            >Withdraw earnings
            <ChevronRightIcon
              class="featured-header-chevron"
              aria-hidden="true"
          /></NuxtLink>
          <span v-else>${{ minWithdraw }} is the withdraw minimum</span>
        </div>
      </div>
    </section>
    <section class="card more-soon">
      <h2 class="title">More coming soon!</h2>
      <p>
        Stay tuned for more metrics and analytics (pretty graphs, anyone? 👀)
        coming to the creators dashboard soon!
      </p>
    </section>
  </div>
</template>

<script>
import ChevronRightIcon from '~/assets/images/utils/chevron-right.svg?inline'

export default {
  components: { ChevronRightIcon },
  data() {
    return {
      totalDownloads: 32421,
      totalImpressions: 124124,
      totalRevenue: 2321,
      currentBalance: 61,
      minWithdraw: 5,
      monthDownloads: 4232,
      monthImpressions: 21412,
      monthRevenue: 127,
    }
  },
  fetch() {},
  head: {
    title: 'Creator dashboard - Modrinth',
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
.card {
  padding: var(--spacing-card-lg);

  p:last-child {
    margin-bottom: 0;
  }
}

.metrics {
  display: grid;
  grid-gap: var(--spacing-card-md);
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));

  .metric {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    background-color: var(--color-bg);
    border-radius: var(--size-rounded-card);
    padding: var(--spacing-card-lg);
    gap: var(--spacing-card-md);

    .label {
      color: var(--color-heading);
      font-weight: bold;
      font-size: 1rem;
    }

    .value {
      color: var(--color-text-dark);
      font-weight: bold;
      font-size: 2rem;
    }
  }
}
</style>
