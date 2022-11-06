<template>
  <div>
    <ModalConfirm
      ref="modal_confirm"
      :title="$t('settings.modals.delete-account.title')"
      :proceed-label="$t('settings.modals.delete-account.action')"
      :confirmation-text="$auth.user.username"
      :has-to-type="true"
      @proceed="deleteAccount"
    >
      <div class="pre">
        <IntlFormatted
          message-id="settings.modals.delete-account.description"
          :tags="['strong']"
        >
          <template #discord-link="{ children }">
            <a href="https://discord.gg/EUHuJHt" target="_blank">
              <Fragment :of="children" />
            </a>
          </template>
        </IntlFormatted>
      </div>
    </ModalConfirm>

    <Modal
      :header="$t('settings.modals.revoke-token.title')"
      :show="showRevokeModal"
      @close="() => toggleRevokeModal(false)"
    >
      <div class="modal-revoke-token markdown-body">
        <IntlFormatted
          :message="$i18n.data['revoke-token.html']"
          :tags="['p', 'ul', 'ol', 'li', 'strong']"
        >
          <template #gh-link="{ children }">
            <a
              href="https://github.com/settings/connections/applications/3acffb2e808d16d4b226"
              target="_blank"
            >
              <Fragment :of="children" />
            </a>
          </template>
        </IntlFormatted>
        <div class="button-group">
          <button
            class="iconified-button"
            @click="() => toggleRevokeModal(false)"
          >
            <CrossIcon />
            {{ $t('generic.action.cancel') }}
          </button>
          <button class="iconified-button brand-button" @click="logout">
            <RightArrowIcon />
            {{ $t('settings.modals.revoke-token.action.log-out') }}
          </button>
        </div>
      </div>
    </Modal>

    <section class="card">
      <div class="header">
        <h2 class="title">{{ $t('settings.display-settings.title') }}</h2>
      </div>
      <label>
        <span>
          <h3>{{ $t('settings.theme.title') }}</h3>
          <span>{{ $t('settings.theme.description') }}</span>
        </span>
        <Multiselect
          v-model="$colorMode.preference"
          :options="['system', 'light', 'dark', 'oled']"
          :custom-label="(value) => $t(`settings.theme.value.${value}`)"
          :searchable="false"
          :close-on-select="true"
          :show-labels="false"
          :allow-empty="false"
        />
      </label>
      <label>
        <span>
          <h3>{{ $t('settings.language.title') }}</h3>
          <span>{{ $t('settings.language.description') }}</span>
        </span>
        <button class="iconified-button" @click="showLanguageModal">
          <LanguageIcon aria-hidden="true" />
          {{ $t('settings.language.action') }}
        </button>
      </label>
      <label>
        <span>
          <h3>{{ $t('settings.right-search-sidebar.title') }}</h3>
          <span>
            {{ $t('settings.right-search-sidebar.description') }}
          </span>
        </span>
        <input
          v-model="searchLayout"
          class="switch stylized-toggle"
          type="checkbox"
          @change="changeLayout"
        />
      </label>
      <label>
        <span>
          <h3>{{ $t('settings.right-project-sidebar.title') }}</h3>

          <span>
            {{ $t('settings.right-project-sidebar.description') }}
          </span>
        </span>
        <input
          v-model="projectLayout"
          class="switch stylized-toggle"
          type="checkbox"
          @change="changeLayout"
        />
      </label>
    </section>

    <section class="card">
      <h2 class="title">{{ $t('settings.auth-token.title') }}</h2>
      <p>
        {{ $t('settings.auth-token.description') }}
      </p>
      <div class="button-group">
        <button
          type="button"
          class="iconified-button stateful-button"
          value="Copy to clipboard"
          @click="copyToken"
        >
          <span :class="{ active: copied }">
            <CheckIcon />
            {{ $t('settings.auth-token.copied') }}
          </span>
          <span :class="{ active: !copied }">
            <ClipboardCopyIcon />
            {{ $t('settings.auth-token.action.copy') }}
          </span>
        </button>
        <button
          type="button"
          class="iconified-button"
          @click="() => toggleRevokeModal(true)"
        >
          {{ $t('settings.auth-token.action.revoke-token') }}
        </button>
      </div>
    </section>

    <section class="card">
      <h2 class="title">{{ $t('settings.delete-account.title') }}</h2>
      <p>
        {{ $t('settings.delete-account.description') }}
      </p>
      <div class="button-group">
        <button
          type="button"
          class="iconified-button danger-button"
          @click="$refs.modal_confirm.show()"
        >
          {{ $t('settings.delete-account.action') }}
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import ModalConfirm from '~/components/ui/ModalConfirm'
import Modal from '~/components/ui/Modal'

import CrossIcon from '~/assets/images/utils/x.svg?inline'
import RightArrowIcon from '~/assets/images/utils/right-arrow.svg?inline'
import CheckIcon from '~/assets/images/utils/check.svg?inline'
import ClipboardCopyIcon from '~/assets/images/utils/clipboard-copy.svg?inline'
import LanguageIcon from '~/assets/images/utils/language.svg?inline'

export default {
  components: {
    Modal,
    ModalConfirm,
    Multiselect,
    CrossIcon,
    RightArrowIcon,
    CheckIcon,
    ClipboardCopyIcon,
    LanguageIcon,
  },
  data() {
    return {
      searchLayout: false,
      projectLayout: false,
      copied: false,
      showRevokeModal: false,
      showDeleteModal: false,
    }
  },
  fetch() {
    this.searchLayout = this.$store.state.cosmetics.searchLayout
    this.projectLayout = this.$store.state.cosmetics.projectLayout
  },
  head() {
    return {
      title: this.$t('meta.title-format', {
        title: this.$t('generic.title.settings'),
      }),
    }
  },
  computed: {
    activeLocale() {
      if (this.$i18n.automatic) {
        return 'auto'
      }

      const activeLocaleCode = this.$i18n.locale

      return this.$i18n.availableLocales.find(
        (it) => it.code === activeLocaleCode
      )
    },
  },
  methods: {
    /** @param {boolean} [newState] Whether to show the revoke modal. */
    toggleRevokeModal(newState) {
      this.showRevokeModal = newState ?? !this.showRevokeModal
    },
    /** @param {boolean} [newState] Whether to show the account deletion modal. */
    toggleDeleteModal(newState) {
      this.showDeleteModal = newState ?? !this.showDeleteModal
    },
    async changeLayout() {
      await this.$store.dispatch('cosmetics/save', {
        searchLayout: this.searchLayout,
        projectLayout: this.projectLayout,
        $cookies: this.$cookies,
      })
    },
    changeTheme() {
      const shift = event.shiftKey
      switch (this.$colorMode.preference) {
        case 'dark':
          this.$colorMode.preference = shift ? 'light' : 'oled'
          break
        case 'oled':
          this.$colorMode.preference = shift ? 'dark' : 'light'
          break
        default:
          this.$colorMode.preference = shift ? 'oled' : 'dark'
      }
    },
    async copyToken() {
      this.copied = true
      await navigator.clipboard.writeText(this.$auth.token)
    },
    async deleteAccount() {
      this.$nuxt.$loading.start()
      try {
        await this.$axios.delete(
          `user/${this.$auth.user.id}`,
          this.$defaultHeaders()
        )
      } catch (err) {
        this.$notify({
          group: 'main',
          title: this.$t('error.generic'),
          text: err.response.data.description,
          type: 'error',
        })
      }
      this.$nuxt.$loading.finish()
    },
    logout() {
      this.showRevokeModal = false
      this.$cookies.set('auth-token-reset', true)

      window.location.href = `${this.$axios.defaults.baseURL}auth/init?url=${process.env.domain}`
    },
    showLanguageModal() {
      this.$store.dispatch('i18n/toggleLanguageModal', true)
    },
  },
}
</script>
<style lang="scss" scoped>
.pre {
  white-space: pre-line;
}

.card {
  padding: var(--spacing-card-lg);
}

.multiselect {
  max-width: 20rem;
}

.modal-revoke-token {
  padding: var(--spacing-card-bg);

  .button-group {
    width: fit-content;
    margin-left: auto;
  }
}

.language-notice {
  padding: var(--spacing-card-bg);
  background: #cce4ff;
  box-shadow: var(--shadow-raised), var(--shadow-inset);
  border-radius: var(--size-rounded-card);
  margin-bottom: var(--spacing-card-md);
  margin-top: var(--spacing-card-md);

  .dark-mode & {
    background: #2a4a6f;
    color: var(--color-text-dark);
  }

  a {
    color: #005fcc;

    .dark-mode & {
      color: #b8d7f9;
    }

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
