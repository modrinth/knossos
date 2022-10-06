<template>
  <div class="page-container">
    <div class="page-contents">
      <div class="content">
        <h1 v-if="$auth.user">
          {{
            $t('settings.authorized-title', { username: $auth.user.username })
          }}
        </h1>
        <h1 v-else>{{ $t('settings.title') }}</h1>
        <NavRow
          class="card"
          :links="[
            {
              label: $t('settings.tab.general'),
              href: '/settings',
            },
            {
              label: $t('settings.follows.title'),
              href: '/settings/follows',
            },
          ]"
        />
        <NuxtChild />
      </div>
    </div>
  </div>
</template>

<script>
import NavRow from '~/components/ui/NavRow'
export default {
  name: 'Settings',
  components: { NavRow },
}
</script>

<style lang="scss" scoped>
.page-contents {
  display: flex;
  flex-direction: column;

  h1 {
    color: var(--color-text-dark);
  }
}

@media screen and (min-width: 1024px) {
  .page-contents {
    max-width: 800px !important;
  }
}
</style>
