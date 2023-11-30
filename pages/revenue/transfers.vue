<template>
  <div>
    <section class="card payout-history">
      <Breadcrumbs
        current-title="Transfer history"
        :link-stack="[{ href: '/revenue', label: 'Revenue' }]"
      />
      <h2>Transfer history</h2>
      <p>
        All of your transfers from your Modrinth balance to your PayPal or Venmo accounts will be
        listed here:
      </p>
      <div class="grid-table">
        <div class="grid-table__row grid-table__header">
          <div class="desktop">Date</div>
          <div class="desktop">Status</div>
          <div class="desktop">Amount</div>
          <div class="mobile">Transaction</div>
        </div>
        <div
          v-for="(payout, index) in payouts.payouts.filter((x) => x.status === 'success')"
          :key="`payout-${index}`"
          class="grid-table__row"
        >
          <div>{{ dayjs(payout.created).format('MMMM D, YYYY [at] h:mm A') }}</div>
          <div><Badge :type="payout.status" /></div>
          <div class="amount">{{ formatMoney(payout.amount) }}</div>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup>
import dayjs from 'dayjs'
import { Badge, Breadcrumbs, formatMoney } from 'omorphia'

useHead({
  title: 'Transfer history - Modrinth',
})

const auth = await useAuth()

const { data: payouts } = await useAsyncData(`user/${auth.value.user.id}/payouts`, () =>
  useBaseFetch(`user/${auth.value.user.id}/payouts`)
)
</script>
<style lang="scss" scoped>
.grid-table {
  display: grid;
  grid-template-columns: auto auto auto;
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-top: var(--gap-md);

  .grid-table__header {
    .mobile {
      display: none;
    }
  }

  .grid-table__row {
    display: contents;

    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: var(--gap-sm);

      // Left edge of table
      &:first-child,
      &.mobile {
        padding-left: var(--gap-lg);
      }

      // Right edge of table
      &:last-child {
        padding-right: var(--gap-lg);
      }
    }

    &:nth-child(2n + 1) > div {
      background-color: var(--color-alt-bg);
    }

    > div {
      padding-top: var(--gap-lg);
      padding-bottom: var(--gap-lg);
    }

    &.grid-table__header > div {
      background-color: var(--color-bg);
      font-weight: bold;
      color: var(--color-contrast);
    }
  }

  @media screen and (max-width: 560px) {
    display: flex;
    flex-direction: column;
    .grid-table__row {
      display: flex;
      flex-direction: column;

      > div {
        padding: var(--gap-xs) var(--gap-lg);

        &:first-child,
        &.mobile {
          padding-top: var(--gap-lg);
        }

        &:last-child,
        &.mobile {
          padding-bottom: var(--gap-lg);
        }
      }
    }

    .grid-table__header {
      .mobile {
        display: flex;
      }
      .desktop {
        display: none;
      }
    }
  }

  .amount {
    color: var(--color-base);
    filter: brightness(1.1);
    font-weight: 500;
  }
}
</style>
