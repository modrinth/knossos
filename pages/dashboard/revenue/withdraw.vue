<template>
  <section class="universal-card">
    <h2>Withdraw</h2>
    <span>
      You are initiating a transfer of your revenue from Modrinth's Creator Monetization Program.
      How much of your
      <strong>{{ $formatMoney(auth.user.payout_data.balance) }}</strong> balance would you like to
      transfer?
    </span>
    <div class="confirmation-input">
      <input
        id="confirmation"
        v-model="amount"
        type="text"
        pattern="^\d*(\.\d{0,2})?$"
        autocomplete="off"
        placeholder="Amount to transfer..."
      />
    </div>

    <Multiselect
      id="license-multiselect"
      v-model="country"
      placeholder="Select country..."
      track-by="id"
      label="name"
      :options="countries"
      :searchable="true"
      :close-on-select="true"
      :show-labels="false"
      @update:model-value="refreshPayoutMethods"
    />

    <h2>Withdraw method</h2>

    <div class="withdraw-options">
      <button
        v-for="method of payoutMethods"
        :key="method.id"
        class="withdraw-option button-base"
        :class="{ selected: selectedMethod === method.id }"
        @click="() => (selectedMethod = method.id)"
      >
        <div class="preview">
          <img :src="method.image_url" :alt="method.name" width="200" />
        </div>
        <div class="label">
          <RadioButtonCheckedIcon v-if="selectedMethod === method.id" class="radio" />
          <RadioButtonIcon v-else class="radio" />
          {{ method.name }}
        </div>
      </button>
    </div>
  </section>
</template>

<script setup>
import { Multiselect } from 'vue-multiselect'
import RadioButtonCheckedIcon from '~/assets/images/utils/radio-button-checked.svg'
import RadioButtonIcon from '~/assets/images/utils/radio-button.svg'

const auth = await useAuth()

const countries = computed(() => {
  const lang = 'en'
  const A = 65
  const Z = 90
  const countryName = new Intl.DisplayNames([lang], { type: 'region' })
  const countries = {}
  for (let i = A; i <= Z; ++i) {
    for (let j = A; j <= Z; ++j) {
      const code = String.fromCharCode(i) + String.fromCharCode(j)
      const name = countryName.of(code)
      if (code !== name) {
        countries[code] = name
      }
    }
  }

  return Object.entries(countries).map((x) => ({
    id: x[0],
    name: x[1],
  }))
})

const amount = ref('')
const country = ref(
  countries.value.find((x) => x.id === (auth.value.user.payout_data.paypal_region ?? 'US'))
)
const selectedMethod = ref('')

const { data: payoutMethods, refresh: refreshPayoutMethods } = await useAsyncData(
  `payout/methods?country=${country.value.id}`,
  () => useBaseFetch(`payout/methods?country=${country.value.id}`, { apiVersion: 3 })
)
</script>

<style lang="scss" scoped>
.theme-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--gap-lg);
}
.theme-option {
  width: 100%;
  border-radius: var(--radius-md);
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--color-divider);
  background-color: var(--color-button-bg);
  color: var(--color-text);

  &.selected {
    color: var(--color-contrast);

    .label svg {
      color: var(--color-brand);
    }
  }

  .preview {
    background-color: var(--color-bg);
    padding: 1.5rem;
  }

  .label {
    display: flex;
    align-items: center;
    padding: var(--gap-md) var(--gap-lg);

    svg {
      margin-right: 0.5rem;
    }
  }
}
</style>
