<template>
  <div>
    <section v-if="enrolled" class="card">
      <h2 class="title">Revenue and metrics</h2>
      <p>View your revenue and metrics in the creator dashboard:</p>
      <NuxtLink class="iconified-button" to="/dashboard/revenue">
        <ChartIcon /> Visit creator dashboard
      </NuxtLink>
    </section>
    <section class="card">
      <h2 class="title">Enrollment</h2>
      <template v-if="editing || !enrolled">
        <p v-if="!enrolled">
          You are not currently enrolled in Modrinth's Creator Monetization
          Program. Setup a method of receiving payments below to enable
          monetization.
        </p>
        <div class="enroll">
          <Chips
            v-model="selectedWallet"
            :items="wallets"
            :format-label="$formatWallet"
            @input="onChangeWallet()"
          />

          <p>
            Enter the information for the
            {{ $formatWallet(selectedWallet) }} account you would like to
            receive your revenue from the Creator Monetization Program:
          </p>
          <div class="enroll-form">
            <Multiselect
              v-model="accountType"
              :options="getAccountTypes()"
              :custom-label="(value) => formatAccountType(value)"
              :searchable="false"
              :close-on-select="true"
              :show-labels="false"
              :allow-empty="false"
            />

            <label class="hidden" for="account-input"
              >{{ $formatWallet(selectedWallet) }}
              {{ formatAccountType(accountType).toLowerCase() }} input
              field</label
            >
            <input
              id="account-input"
              v-model="account"
              name="account-input"
              :placeholder="`Enter your ${$formatWallet(
                selectedWallet
              )} ${formatAccountType(accountType).toLowerCase()}...`"
              :type="accountType === 'email' ? 'email' : ''"
            />
          </div>
          <button
            class="save-button iconified-button brand-button"
            @click="saveInformation()"
          >
            <SaveIcon /> Save information
          </button>
        </div>
      </template>
      <template v-else>
        <p>
          You are currently enrolled in the Creator Monetization Program with a
          {{ $formatWallet(selectedWallet) }} account.
        </p>
        <button class="iconified-button brand-button" @click="editing = true">
          <EditIcon /> Edit information
        </button>
      </template>
    </section>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import Chips from '~/components/ui/Chips'
import SaveIcon from '~/assets/images/utils/save.svg?inline'
import EditIcon from '~/assets/images/utils/edit.svg?inline'
import ChartIcon from '~/assets/images/utils/chart.svg?inline'

export default {
  components: {
    Multiselect,
    Chips,
    SaveIcon,
    EditIcon,
    ChartIcon,
  },
  data() {
    return {
      editing: false,
      enrolled: false,
      wallets: ['paypal', 'venmo'],
      selectedWallet: 'paypal',
      accountType: this.getAccountTypes()[0],
      account: 'example@gmail.com',
    }
  },
  head: {
    title: 'Monetization settings - Modrinth',
  },
  methods: {
    getAccountTypes() {
      const types = []
      if (this.selectedWallet === 'venmo') {
        types.push('user_handle')
      }
      types.push('email')
      types.push('phone')
      return types
    },
    formatAccountType(value) {
      switch (value) {
        case 'email':
          return 'Email address'
        case 'phone':
          return 'Phone number'
        case 'user_handle':
          return 'Username'
        default:
          return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },
    onChangeWallet() {
      this.account = ''

      // Set default account type for each wallet
      if (this.selectedWallet === 'paypal') {
        this.accountType = 'email'
      } else if (this.selectedWallet === 'venmo') {
        this.accountType = 'user_handle'
      }
    },
    saveInformation() {
      this.editing = false
      this.enrolled = true
    },
  },
}
</script>
<style lang="scss" scoped>
.card {
  padding: var(--spacing-card-lg);
}

.iconified-button {
  width: fit-content;
}

.enroll {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-card-md);

  p {
    margin: 0;
  }

  .enroll-form {
    display: flex;
    flex-direction: row;
    justify-content: left;
    width: 100%;
    gap: var(--spacing-card-md);

    .multiselect {
      width: 15rem;
    }

    input {
      box-sizing: border-box;
      max-height: 40px;
      width: 50%;
      margin: 0;
    }

    @media screen and (max-width: 750px) {
      flex-direction: column;
    }
  }
}
</style>
