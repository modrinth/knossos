<template>
  <Modal ref="modal" :header="'Transfer to ' + $formatWallet(wallet)">
    <div class="modal-transfer">
      <span
        >You are initiating a transfer of your revenue from Modrinth's Creator
        Monetization Program. How much of your
        <span class="important-text">${{ balance }}</span> balance would you
        like to transfer?</span
      >
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
      <div class="confirm-text">
        <Checkbox
          v-if="
            isValidInput() &&
            parseInput() >= minWithdraw &&
            parseInput() <= balance
          "
          v-model="consentedFee"
        >
          I acknowledge that {{ $formatWallet(wallet) }} charges a $0.25
          processing fee for every transfer and it will be subtracted from the
          total I receive.
        </Checkbox>
        <Checkbox
          v-if="
            isValidInput() &&
            parseInput() >= minWithdraw &&
            parseInput() <= balance
          "
          v-model="consentedAccount"
        >
          I acknowledge that I am transferring ${{ parseInput() - 0.25 }} to the
          following {{ $formatWallet(wallet) }} account: {{ account }}
        </Checkbox>
        <span
          v-else-if="validInput && parseInput() < minWithdraw"
          class="invalid"
        >
          The amount must be at least ${{ minWithdraw }}</span
        >
        <span v-else-if="validInput && parseInput() > balance" class="invalid">
          The amount must be no more than ${{ balance }}</span
        >
        <span v-else-if="amount.length > 0" class="invalid">
          {{ amount }} is not a valid amount</span
        >
      </div>
      <div class="button-group">
        <NuxtLink class="iconified-button" to="/settings/monetization">
          <SettingsIcon /> Monetization settings
        </NuxtLink>
        <button class="iconified-button" @click="cancel">
          <CrossIcon />
          Cancel
        </button>
        <button
          class="iconified-button brand-button"
          :disabled="!consentedFee || !consentedAccount"
          @click="proceed"
        >
          <TransferIcon />
          Transfer
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import CrossIcon from '~/assets/images/utils/x.svg?inline'
import TransferIcon from '~/assets/images/utils/transfer.svg?inline'
import SettingsIcon from '~/assets/images/utils/settings.svg?inline'
import Modal from '~/components/ui/Modal'
import Checkbox from '~/components/ui/Checkbox'

export default {
  name: 'ModalTransfer',
  components: {
    Checkbox,
    CrossIcon,
    SettingsIcon,
    TransferIcon,
    Modal,
  },
  props: {
    wallet: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    minWithdraw: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      consentedFee: false,
      consentedAccount: false,
      amount: '',
      validInput: false,
    }
  },
  methods: {
    cancel() {
      this.amount = ''
      this.consentedFee = false
      this.consentedAccount = false
      this.validInput = false
      this.$refs.modal.hide()
    },
    proceed() {
      this.$refs.modal.hide()
    },
    show() {
      this.$refs.modal.show()
    },
    isValidInput() {
      const regex = /^\$?(\d*(\.\d{2})?)$/gm
      this.validInput = regex.test(this.amount) && this.amount.length > 0
      return this.validInput
    },
    parseInput() {
      const regex = /^\$?(\d*(\.\d{2})?)$/gm
      const matches = regex.exec(this.amount)
      return parseFloat(matches[1])
    },
  },
}
</script>

<style scoped lang="scss">
.modal-transfer {
  padding: var(--spacing-card-bg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-card-sm);

  .confirmation-input {
    input {
      width: 14rem;
      max-width: 100%;
    }
  }

  .button-group {
    margin-left: auto;
    margin-top: 1.5rem;
  }

  .important-text {
    color: var(--color-text-dark);
    font-weight: bold;
  }

  .invalid {
    color: var(--color-badge-red-bg);
  }

  .confirm-text {
    margin-top: var(--spacing-card-sm);
    min-height: 6rem;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-card-sm);
  }
}
</style>
