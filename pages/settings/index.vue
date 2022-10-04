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
        <i18n-formatted message-id="settings.modals.delete-account.description">
          <strong v-i18n:wrap="'strong'" />
          <a
            v-i18n:wrap="'discord-link'"
            href="https://discord.gg/EUHuJHt"
            target="_blank"
          />
        </i18n-formatted>
      </div>
    </ModalConfirm>

    <Modal
      ref="modal_revoke_token"
      :header="$t('settings.modals.revoke-token.title')"
    >
      <div class="modal-revoke-token markdown-body">
        <i18n-formatted
          :message="$i18n.data['revoke-token.html']"
          :tags="['p', 'ul', 'ol', 'li', 'strong']"
        >
          <a
            v-i18n:wrap="'gh-link'"
            href="https://github.com/settings/connections/applications/3acffb2e808d16d4b226"
            target="_blank"
          />
        </i18n-formatted>
        <div class="button-group">
          <button
            class="iconified-button"
            @click="$refs.modal_revoke_token.hide()"
          >
            <CrossIcon />
            {{ $t('settings.modals.revoke-token.action.cancel') }}
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
        <Multiselect
          :value="
            $i18n.automatic
              ? 'auto'
              : $i18n.availableLocales.find((it) => it.code === $i18n.locale)
          "
          :options="['auto', ...$i18n.availableLocales]"
          :custom-label="
            (locale) => {
              if (locale === 'auto') {
                return $t('settings.language.value.auto')
              }

              const customName =
                locale.data != null ? locale.data.customLocaleName : null

              if (customName == null) {
                return new Intl.DisplayNames(locale.code, {
                  type: 'language',
                }).of(locale.code)
              }

              return customName
            }
          "
          :searchable="false"
          :close-on-select="true"
          :show-labels="false"
          :allow-empty="false"
          @select="
            (locale) =>
              $i18n.changeLocale(locale === 'auto' ? locale : locale.code)
          "
        />
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
          @click="$refs.modal_revoke_token.show()"
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

export default {
  components: {
    Modal,
    ModalConfirm,
    Multiselect,
    CrossIcon,
    RightArrowIcon,
    CheckIcon,
    ClipboardCopyIcon,
  },
  data() {
    return {
      searchLayout: false,
      projectLayout: false,
      copied: false,
    }
  },
  fetch() {
    this.searchLayout = this.$store.state.cosmetics.searchLayout
    this.projectLayout = this.$store.state.cosmetics.projectLayout
  },
  head() {
    return {
      title: this.$t('meta.title-format', {
        title: this.$t('settings.title'),
      }),
    }
  },
  methods: {
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
      this.$refs.modal_revoke_token.hide()
      this.$cookies.set('auth-token-reset', true)

      window.location.href = `${this.$axios.defaults.baseURL}auth/init?url=${process.env.domain}`
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
</style>
