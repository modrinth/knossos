<template>
  <div>
    <section class="universal-card">
      <h2>CurseForge</h2>
      <p>
        Modrinth can use your CurseForge account's API token in order to
        automatically sync new versions of your projects to CurseForge.
      </p>
      <template v-if="$auth.user.has_flame_anvil_key && !editing">
        <p>You have added a CurseForge API token to your account.</p>
        <div class="input-group">
          <button
            class="iconified-button"
            @click="
              flameAnvilToken = null
              saveChanges()
            "
          >
            <TrashIcon /> Remove Token
          </button>
          <button class="iconified-button brand-button" @click="editing = true">
            <EditIcon /> Edit token
          </button>
        </div>
      </template>
      <template v-else>
        <label for="curseforge-api-token">
          <span class="label__title">CurseForge API token</span>
          <span class="label__description">
            Create CurseForge API tokens in your
            <a
              class="text-link"
              href="https://www.curseforge.com/account/api-tokens"
              target="_blank"
            >
              CurseForge account settings </a
            >.
          </span>
        </label>
        <div class="input-group">
          <input
            id="curseforge-api-token"
            v-model="flameAnvilToken"
            maxlength="40"
            type="text"
            :placeholder="`Enter your CurseForge account's API token...`"
          />
        </div>
        <button class="iconified-button brand-button" @click="saveChanges">
          <SaveIcon /> Save changes
        </button>
      </template>
    </section>
  </div>
</template>

<script>
import SaveIcon from '~/assets/images/utils/save.svg?inline'
import EditIcon from '~/assets/images/utils/edit.svg?inline'
import TrashIcon from '~/assets/images/utils/trash.svg?inline'

export default {
  components: {
    SaveIcon,
    EditIcon,
    TrashIcon,
  },
  data() {
    return {
      flameAnvilToken: '',
      editing: false,
    }
  },
  head: {
    title: 'Integrations - Modrinth',
  },
  methods: {
    async saveChanges() {
      this.$nuxt.$loading.start()
      try {
        const data = {
          flame_anvil_key:
            this.flameAnvilToken === '' ? null : this.flameAnvilToken,
        }

        await this.$axios.patch(
          `user/${this.$auth.user.id}`,
          data,
          this.$defaultHeaders()
        )
        await this.$store.dispatch('auth/fetchUser', {
          token: this.$auth.token,
        })
        this.editing = false
      } catch (err) {
        this.$notify({
          group: 'main',
          title: 'An error occurred',
          text: err.response.data.description,
          type: 'error',
        })
      }
      this.$nuxt.$loading.finish()
    },
  },
}
</script>
<style lang="scss" scoped></style>
