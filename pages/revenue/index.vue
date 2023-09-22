<template>
  <div>
    <ModalTransfer
      v-if="enrolled"
      ref="modal_transfer"
      :wallet="auth.user.payout_data.payout_wallet"
      :account-type="auth.user.payout_data.payout_wallet_type"
      :account="auth.user.payout_data.payout_address"
      :balance="auth.user.payout_data.balance"
      :min-withdraw="minWithdraw"
    />
    <section class="universal-card">
      <h2>Withdraw</h2>
      <div v-if="auth.user.payout_data.balance >= minWithdraw">
        <p>
          You have
          <strong>{{ $formatMoney(auth.user.payout_data.balance) }}</strong>
          available to withdraw.
          <span v-if="!enrolled"
            >Enroll in the Creator Monetization Program to withdraw your revenue.</span
          >
        </p>
      </div>
      <p v-else-if="auth.user.payout_data.balance > 0">
        You have made
        <strong>{{ $formatMoney(auth.user.payout_data.balance) }}</strong
        >, however you have not yet met the minimum of ${{ minWithdraw }} to withdraw.
      </p>
      <p v-else>
        You have made
        <strong>{{ $formatMoney(auth.user.payout_data.balance) }}</strong
        >, which is under the minimum of ${{ minWithdraw }} to withdraw.
      </p>
      <div v-if="!enrolled">
        <NuxtLink class="iconified-button" to="/settings/monetization">
          <SettingsIcon /> Enroll in the Creator Monetization Program
        </NuxtLink>
      </div>
      <div v-if="enrolled" class="input-group">
        <button
          v-if="auth.user.payout_data.balance >= minWithdraw"
          class="iconified-button brand-button"
          @click="$refs.modal_transfer.show()"
        >
          <TransferIcon /> Transfer to
          {{ $formatWallet(auth.user.payout_data.payout_wallet) }}
        </button>
        <NuxtLink class="iconified-button" to="/revenue/transfers">
          <HistoryIcon /> View transfer history
        </NuxtLink>
        <NuxtLink class="iconified-button" to="/settings/monetization">
          <SettingsIcon /> Monetization settings
        </NuxtLink>
      </div>
    </section>
    <Card class="total-revenue">
      <div class="title">
        <DropdownSelect
          v-model="revenueResolution"
          class="resolution-dropdown"
          :options="['Daily', 'Weekly', 'Monthly', 'Yearly']"
        />
        <div class="word">Revenue</div>
      </div>
      <client-only>
        <div class="chart">
          <client-only>
            <BarChart :data="paymentData" />
          </client-only>
        </div>
      </client-only>
    </Card>
    <Card class="ratio-data">
      <div class="title">Download : Page view revenue ratio</div>
      <div class="data">
        <div class="graph-grid">
          <div class="graph-wrapper">
            <client-only>
              <PieChart :data="downloadRatioData" class="graph" />
            </client-only>
          </div>
        </div>
        <div class="list-wrapper">
          <div class="ratios-list">
            <div v-for="ratio in ratioData" class="ratio-row">
              <div class="ratio-title">
                {{ ratio.title }}
              </div>
              <div class="ratio">
                <div class="bar">
                  <div class="fill" :style="{ width: `${ratio.data}%` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
    <Card class="revenue-card">
      <div class="title">Revenue history</div>
      <div class="table revenue">
        <div class="table-head table-row">
          <div class="table-cell">Title</div>
          <div class="table-cell">Revenue</div>
          <div class="table-cell">Downloads</div>
          <div class="table-cell">Page views</div>
        </div>
        <div v-for="item in historyData" class="table-row">
          <div class="table-cell">
            <Checkbox
              v-model="item.showing"
              :label="dayjs(item.date).format('MMMM D, YYYY')"
              :collapsing-toggle-style="true"
            />
          </div>
          <div class="table-cell">
            {{ $formatMoney(item.data.map((value) => value.data).reduce((a, b) => a + b)) }}
          </div>
          <div class="table-cell">
            {{ item.data.map((value) => value.downloads).reduce((a, b) => a + b) }}
          </div>
          <div class="table-cell">
            {{ item.data.map((value) => value.pageViews).reduce((a, b) => a + b) }}
          </div>
        </div>
      </div>
    </Card>
    <Card class="transaction-card">
      <div class="title">Transaction history</div>
      <div class="table transactions">
        <div class="table-row table-head">
          <div class="table-cell">Date</div>
          <div class="table-cell">Status</div>
          <div class="table-cell">Amount</div>
        </div>
        <div
          v-for="(payout, index) in payouts.payouts.filter((x) => x.status === 'success')"
          :key="`payout-${index}`"
          class="table-row"
        >
          <div class="table-cell">
            {{ $dayjs(payout.created).format('MMMM D, YYYY [at] h:mm A') }}
          </div>
          <div class="table-cell"><Badge :type="payout.status" /></div>
          <div class="table-cell amount">{{ $formatMoney(payout.amount) }}</div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script setup>
import { Card, BarChart, PieChart, DropdownSelect } from 'omorphia'
import dayjs from 'dayjs'
import TransferIcon from '~/assets/images/utils/transfer.svg'
import SettingsIcon from '~/assets/images/utils/settings.svg'
import HistoryIcon from '~/assets/images/utils/history.svg'
import ModalTransfer from '~/components/ui/ModalTransfer.vue'

import { useAuth } from '~/composables/auth.js'
import Checkbox from '~/components/ui/Checkbox.vue'
import Badge from '~/components/ui/Badge.vue'

const auth = ref(await useAuth())

const { data: payouts } = await useAsyncData(`user/${auth.value.user.id}/payouts`, () =>
  useBaseFetch(`user/${auth.value.user.id}/payouts`)
)

const minWithdraw = 0.26

const enrolled =
  auth.value.user.payout_data.payout_wallet &&
  auth.value.user.payout_data.payout_wallet_type &&
  auth.value.user.payout_data.payout_address

const paymentData = ref({
  labels: [
    '2022-01-10',
    '2022-01-11',
    '2022-01-12',
    '2022-01-13',
    '2022-01-14',
    '2022-01-15',
    '2022-01-16',
    '2022-01-17',
    '2022-01-18',
    '2022-01-19',
    '2022-01-20',
    '2022-01-21',
    '2022-01-22',
    '2022-01-23',
    '2022-01-24',
    '2022-01-25',
  ],
  data: [
    {
      title: 'Spirit',
      data: [120, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 900, 800, 700, 600],
      color: 0x3c67c2,
    },
    {
      title: 'Ad Astra',
      data: [111, 222, 333, 444, 555, 666, 777, 888, 999, 111, 222, 333, 444, 555, 666, 777],
      color: 0x9f46ff,
    },
    {
      title: 'Tempad',
      data: [123, 234, 345, 456, 567, 678, 789, 890, 901, 123, 234, 345, 456, 567, 678, 789],
      color: 0xff6318,
    },
  ],
})

const downloadRatioData = ref({
  Title: 'Download : Page view revenue ratio',
  data: [
    {
      title: 'Downloads',
      data: 0.6,
      color: 0x3c67c2,
    },
    {
      title: 'Page Views',
      data: 0.4,
      color: 0x9f46ff,
    },
  ],
})

const ratioData = [
  {
    title: 'Spirit',
    data: 60,
  },
  {
    title: 'Tempad',
    data: 40,
  },
  {
    title: 'Spirit',
    data: 60,
  },
  {
    title: 'Tempad',
    data: 40,
  },
  {
    title: 'Spirit',
    data: 60,
  },
  {
    title: 'Tempad',
    data: 40,
  },
  {
    title: 'Spirit',
    data: 60,
  },
  {
    title: 'Spirit',
    data: 60,
  },
  {
    title: 'Tempad',
    data: 40,
  },
  {
    title: 'Spirit',
    data: 60,
  },
  {
    title: 'Tempad',
    data: 40,
  },
  {
    title: 'Spirit',
    data: 60,
  },
  {
    title: 'Spirit',
    data: 60,
  },
  {
    title: 'Tempad',
    data: 40,
  },
  {
    title: 'Spirit',
    data: 60,
  },
  {
    title: 'Tempad',
    data: 40,
  },
  {
    title: 'Spirit',
    data: 60,
  },
  {
    title: 'Spirit',
    data: 60,
  },
  {
    title: 'Spirit',
    data: 60,
  },
  {
    title: 'Tempad',
    data: 40,
  },
  {
    title: 'Spirit',
    data: 60,
  },
  {
    title: 'Tempad',
    data: 40,
  },
  {
    title: 'Spirit',
    data: 60,
  },
  {
    title: 'Spirit',
    data: 60,
  },
  {
    title: 'Spirit',
    data: 60,
  },
  {
    title: 'Tempad',
    data: 40,
  },
  {
    title: 'Spirit',
    data: 60,
  },
  {
    title: 'Tempad',
    data: 40,
  },
  {
    title: 'Spirit',
    data: 60,
  },
]

const historyData = ref([
  {
    date: '2022-01-10',
    data: [
      {
        title: 'Spirit',
        data: 120,
        pageViews: 1000,
        downloads: 600,
      },
      {
        title: 'Ad Astra',
        data: 111,
        pageViews: 1000,
        downloads: 600,
      },
      {
        title: 'Tempad',
        data: 123,
        pageViews: 1000,
        downloads: 600,
      },
    ],
  },
  {
    date: '2022-01-11',
    data: [
      {
        title: 'Spirit',
        data: 100,
        pageViews: 1000,
        downloads: 600,
      },
      {
        title: 'Ad Astra',
        data: 222,
        pageViews: 1000,
        downloads: 600,
      },
      {
        title: 'Tempad',
        data: 234,
        pageViews: 1000,
        downloads: 600,
      },
    ],
  },
  {
    date: '2022-01-12',
    data: [
      {
        title: 'Spirit',
        data: 85,
        pageViews: 1000,
        downloads: 600,
      },
      {
        title: 'Ad Astra',
        data: 180,
        pageViews: 1000,
        downloads: 600,
      },
      {
        title: 'Tempad',
        data: 150,
        pageViews: 1000,
        downloads: 600,
      },
    ],
  },
  {
    date: '2022-01-13',
    data: [
      {
        title: 'Spirit',
        data: 160,
        pageViews: 1000,
        downloads: 600,
      },
      {
        title: 'Ad Astra',
        data: 95,
        pageViews: 1000,
        downloads: 600,
      },
      {
        title: 'Tempad',
        data: 200,
        pageViews: 1000,
        downloads: 600,
      },
    ],
  },
  {
    date: '2022-01-14',
    data: [
      {
        title: 'Spirit',
        data: 75,
        pageViews: 1000,
        downloads: 600,
      },
      {
        title: 'Ad Astra',
        data: 120,
        pageViews: 1000,
        downloads: 600,
      },
      {
        title: 'Tempad',
        data: 185,
        pageViews: 1000,
        downloads: 600,
      },
    ],
  },
])

const revenueResolution = ref('Daily')
</script>
<style lang="scss" scoped>
strong {
  color: var(--color-text-dark);
  font-weight: 500;
}

.total-revenue {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
  padding: var(--gap-xl);

  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--gap-md);

    .resolution-dropdown {
      width: unset;

      :deep(.selected) {
        font-size: var(--font-size-lg);
        font-weight: bold;
        color: var(--color-contrast);
        border: 1px solid var(--color-button-bg);
        background-color: var(--color-raised-bg);
      }

      :deep(.options) {
        border: 1px solid var(--color-button-bg);

        .option {
          background-color: var(--color-raised-bg);
        }

        .selected-option {
          background-color: var(--color-brand);
        }
      }
    }

    .word {
      font-size: var(--font-size-lg);
      font-weight: bold;
      color: var(--color-contrast);
    }
  }

  .chart {
    padding: var(--gap-lg);
    background-color: var(--color-bg);
    border-radius: var(--radius-lg);
  }
}

.data {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--gap-lg);
  height: min-content;
}

.bar {
  width: 100%;
  height: 1rem;
  background-color: var(--color-green);
  border-radius: var(--radius-md);
  overflow: hidden;

  .fill {
    height: 100%;
    background-color: var(--color-blue);
    border-right: 2px solid var(--color-bg);
  }
}

.ratio-data {
  padding: var(--gap-xl);
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);

  .title {
    font-size: var(--font-size-xl);
    font-weight: bold;
    color: var(--color-text-dark);
  }

  .data {
    .graph-grid {
      border-radius: var(--radius-lg);
      background-color: var(--color-bg);
      height: min-content;
      grid-row: 1;
    }

    .graph {
      width: 100% !important;
      height: calc(100% - 8rem) !important;
      padding: var(--gap-xl);
      object-fit: cover;
    }

    .graph-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: var(--gap-md);
      margin: -3rem 0;
    }
  }

  .list-wrapper {
    height: 100%;
    background-color: var(--color-bg);
    padding: var(--gap-xl);
    border-radius: var(--radius-lg);
    position: relative;
  }

  .ratios-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
    grid-row: 1;
    width: calc(100% - 2 * var(--gap-md) - var(--gap-xl));
    height: calc(100% - 2 * var(--gap-md) - var(--gap-xl));
    position: absolute;
    overflow-y: auto;

    .ratio-row {
      display: grid;
      grid-template-columns: 1fr 2fr;
    }
  }
}

.revenue {
  .table-row {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
}

.transactions {
  .table-row {
    grid-template-columns: 2fr 1fr 1fr;
  }
}

.revenue-card,
.transaction-card {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
  padding: var(--gap-xl);
  border-radius: var(--radius-lg);
  height: min-content;

  .title {
    font-size: var(--font-size-xl);
    font-weight: bold;
    color: var(--color-contrast);
  }
}
</style>
