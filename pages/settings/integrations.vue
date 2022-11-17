<template>
  <div>
    <section class="universal-card">
      <h2>CurseForge</h2>
      <p>
        Modrinth can use your CurseForge account's API token in order to
        automatically sync new versions of your projects to CurseForge.
      </p>
      <label for="curseforge-api-token"
        ><span class="label__title">CurseForge API token</span>
        <span class="label__description"
          >Create CurseForge API tokens in your
          <a
            class="text-link"
            href="https://www.curseforge.com/account/api-tokens"
            target="_blank"
          >
            CurseForge account settings</a
          >.</span
        >
      </label>
      <div class="input-group">
        <input
          id="curseforge-api-token"
          v-model="flameAnvilToken"
          maxlength="40"
          :type="showToken ? 'text' : 'password'"
          :placeholder="`Enter your CurseForge account's API token...`"
        />
        <button class="iconified-button" @click="showToken = !showToken">
          <template v-if="showToken"> <EyeOffIcon /> Hide token </template>
          <template v-else> <EyeIcon /> Show token </template>
        </button>
      </div>
      <button
        class="iconified-button brand-button"
        :disabled="originalFlameAnvilToken === flameAnvilToken"
        @click="saveChanges"
      >
        <SaveIcon /> Save changes
      </button>
    </section>
  </div>
</template>

<script>
import SaveIcon from '~/assets/images/utils/save.svg?inline'
import EyeIcon from '~/assets/images/utils/eye.svg?inline'
import EyeOffIcon from '~/assets/images/utils/eye-off.svg?inline'

export default {
  components: {
    SaveIcon,
    EyeIcon,
    EyeOffIcon,
  },
  data() {
    return {
      originalFlameAnvilToken: '',
      flameAnvilToken: '',
      showToken: false,
    }
  },
  head: {
    title: 'Integration settings - Modrinth',
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
