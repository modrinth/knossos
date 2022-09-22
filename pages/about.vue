<template>
  <div class="main">
    <div class="card">
      <h1>{{ $t('about.title') }}</h1>
      <p>
        {{ $t('about.story.p-founding') }}
      </p>

      <p>
        <i18n-formatted message-id="about.story.p-goals">
          <a
            v-i18n:wrap="'gh-org-link'"
            target="_blank"
            href="https://github.com/modrinth"
          />
        </i18n-formatted>
      </p>

      <p>
        {{ $t('about.story.p-beta') }}
      </p>
      <h2>{{ $t('about.making.h-how-does-work') }}</h2>
      <p>
        {{ $t('about.making.p-not-just-site') }}
      </p>

      <p>
        <i18n-formatted message-id="about.making.p-technology">
          <a
            v-i18n:wrap="'l-repo-link'"
            target="_blank"
            href="https://github.com/modrinth/labrinth"
          />
          <a
            v-i18n:wrap="'k-repo-link'"
            target="_blank"
            href="https://github.com/modrinth/knossos"
          />
        </i18n-formatted>
      </p>

      <p>
        <i18n-formatted message-id="about.making.p-tools">
          <a
            v-i18n:wrap="'minotaur-link'"
            target="_blank"
            href="https://github.com/modrinth/minotaur"
          />
          <a
            v-i18n:wrap="'minos-link'"
            target="_blank"
            href="https://github.com/modrinth/minos"
          />
          <a
            v-i18n:wrap="'gh-org-link'"
            target="_blank"
            href="https://github.com/modrinth"
          />
        </i18n-formatted>
      </p>
      <h2>{{ $t('about.api.h-backend-docs') }}</h2>
      <p>
        <i18n-formatted message-id="about.api.p-where-find-docs">
          <a
            v-i18n:wrap="'docs-link'"
            target="_blank"
            href="https://docs.modrinth.com"
          />
        </i18n-formatted>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  auth: false,
  head() {
    return {
      title: this.$t('meta.title-format', { title: this.$t('about.title') }),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('about.meta.description'),
        },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: this.$t('about.title'),
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.$t('about.title'),
        },
        {
          hid: 'og:url',
          name: 'og:url',
          content: `https://modrinth.com/about`,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.main {
  margin: var(--spacing-card-sm) auto;
  max-width: 800px;
}

a {
  text-decoration: underline;
  color: var(--color-link);
}
</style>
