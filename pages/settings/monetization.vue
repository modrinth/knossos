<template>
  <div>
    <section v-if="auth.user.payout_data.trolley_status === 'active'" class="universal-card">
      <h2>Revenue and metrics</h2>
      <p>View your revenue and metrics in the creator dashboard:</p>
      <NuxtLink class="iconified-button" to="/dashboard/revenue">
        <ChartIcon /> Visit creator dashboard
      </NuxtLink>
    </section>
    <section class="universal-card">
      <h2 class="title">Trolley Account</h2>
      <template v-if="!auth.user.email">
        You are not currently enrolled in Modrinth's Creator Monetization Program. In order to
        enroll, you must first add a valid email address to your account.
        <NuxtLink class="iconified-button" to="/settings/account">
          <SettingsIcon /> Visit account settings
        </NuxtLink>
      </template>
      <template v-else-if="!auth.user.payout_data.trolley_status">
        <p>
          You are not currently enrolled in Modrinth's Creator Monetization Program. Please fill out
          some information about yourself to begin setting up your Trolley account (our payments
          provider).
        </p>
        <div class="enroll universal-body">
          <Chips v-model="accountType" :items="accountTypes" />

          <template v-if="accountType === 'individual'">
            <p>
              Please enter your legal first and last name below as it shows on tax documents.
              <strong
                >These must be accurate for you to be able to receive payouts from Modrinth.</strong
              >
            </p>
            <label for="first-name">
              <span class="label__title">First Name</span>
            </label>
            <input
              id="first-name"
              v-model="firstName"
              maxlength="2048"
              type="text"
              placeholder="Enter legal first name..."
            />
            <label for="last-name">
              <span class="label__title">Last Name</span>
            </label>
            <input
              id="last-name"
              v-model="lastName"
              maxlength="2048"
              type="text"
              placeholder="Enter legal last name..."
            />
          </template>

          <template v-if="accountType === 'business'">
            <p>Please enter your business's legal name as it shows on tax documents.</p>
            <label for="business-name">
              <span class="label__title">Business Name</span>
            </label>
            <input
              id="business-name"
              v-model="firstName"
              maxlength="2048"
              type="text"
              placeholder="Enter business legal name..."
            />
          </template>

          <div class="rewards-checkbox">
            <Checkbox v-model="agreed">
              I agree to the
              <nuxt-link to="/legal/cmp" class="goto-link">Rewards Program Terms</nuxt-link>
            </Checkbox>
          </div>
          <div class="input-group">
            <button
              :disabled="!agreed"
              class="iconified-button brand-button"
              @click="registerTrolley"
            >
              <RightArrowIcon /> Begin registration
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <p v-if="auth.user.payout_data?.trolley_status === 'active'">
          You are currently enrolled in the Creator Monetization Program. Visit the payments portal
          below to view or modify your account information.
        </p>
        <p
          v-else-if="
            auth.user.payout_data?.trolley_status === 'disabled' ||
            auth.user.payout_data?.trolley_status === 'suspended' ||
            auth.user.payout_data?.trolley_status === 'blocked' ||
            auth.user.payout_data?.trolley_status === 'archived'
          "
        >
          Your Trolley account has been disabled. Please contact Modrinth support for more
          information.
        </p>
        <p v-else>
          Your trolley account setup is incomplete. Please visit the portal below and complete your
          account information. If your account information is complete, please wait up to 24 hours
          for account approval.
        </p>
        <a
          :href="config.public.payoutsPortalUrl"
          class="iconified-button brand-button"
          target="_blank"
        >
          <ExternalIcon /> Visit trolley portal
        </a>
      </template>
    </section>
  </div>
</template>

<script setup>
import { Checkbox } from 'omorphia'
import Chips from '~/components/ui/Chips.vue'
import RightArrowIcon from '~/assets/images/utils/right-arrow.svg'
import ChartIcon from '~/assets/images/utils/chart.svg'
import ExternalIcon from '~/assets/images/utils/external.svg'
import SettingsIcon from '~/assets/images/utils/settings.svg'

definePageMeta({
  middleware: 'auth',
})

const config = useRuntimeConfig()
const auth = await useAuth()

const accountTypes = ref(['individual', 'business'])
const accountType = ref(accountTypes.value[0])
const firstName = ref('')
const lastName = ref('')

const agreed = ref(false)

async function registerTrolley() {
  startLoading()

  try {
    const data = {
      type: accountType.value,
      first: firstName.value,
      last: lastName.value,
      name: firstName.value,
    }

    await useBaseFetch(`auth/trolley/link`, {
      method: 'POST',
      body: data,
    })

    auth.value = (await useAuth(auth.value.token)).value
    console.log(auth.value)
  } catch (err) {
    const app = useNuxtApp()
    app.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err.data.description,
      type: 'error',
    })
  }
  stopLoading()
}

useHead({
  title: 'Monetization settings - Modrinth',
})
</script>
<style lang="scss" scoped>
.account-input {
  flex: 1;
}

.rewards-checkbox {
  margin-bottom: 0.75rem;

  a {
    margin-left: 0.5ch;
  }
}
</style>
