<template>
  <div>
    <div class="section-header columns">
      <h3 class="column-grow-1">{{ $t('revokeToken.title') }}</h3>
    </div>
    <section class="essentials pad-maker">
      <p>{{ $t('revokeToken.description') }}</p>
      <ul>
        <li>{{ $t('revokeToken.desc.bullet1') }}</li>
        <li>{{ $t('revokeToken.desc.bullet2') }}</li>
        <li>{{ $t('revokeToken.desc.bullet3') }}</li>
      </ul>
      <p>{{ $t('revokeToken.instructions') }}</p>
      <ol>
        <li>
          <a
            href="https://github.com/settings/connections/applications/3acffb2e808d16d4b226"
            target="_blank"
          >
            {{ $t('revokeToken.inst.bullet1Url') }}</a
          >
          {{ $t('revokeToken.inst.bullet1Desc') }}
        </li>
        <li>{{ $t('revokeToken.inst.bullet2') }}</li>
      </ol>
      <p>{{ $t('revokeToken.continue') }}</p>
      <p>
        <strong>{{ $t('revokeToken.continueWarning') }}</strong>
      </p>
      <button @click="logout">{{ $t('generic.continue') }}</button>
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  methods: {
    async logout() {
      this.$cookies.set('auth-token-reset', true)
      await this.$router.replace(
        `auth/init?url=${process.env.domain}${this.$route.fullPath}`
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.pad-rem {
  margin-top: 0;
}

.pad-maker {
  margin-top: var(--spacing-card-md);
}

.save-btn-div {
  overflow: hidden;
  clear: both;
}

.save-btn {
  float: right;
}

a {
  color: var(--color-link);
  text-decoration: underline;
}

section {
  @extend %card;
  padding: var(--spacing-card-md) var(--spacing-card-lg);
}

label {
  display: flex;

  span {
    flex: 2;
    padding-right: var(--spacing-card-lg);
  }

  input {
    flex: 3;
    height: fit-content;
  }

  button {
    :hover {
      cursor: pointer;
    }

    height: fit-content;
    flex: 1;
  }
}
</style>
