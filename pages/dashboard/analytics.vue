<script>
export default defineNuxtComponent({
  head: {
    title: 'Analytics - Modrinth',
  },
})
</script>

<template>
  <div>
    <section class="universal-card">
      <h2>Analytics</h2>
      <p>You found a secret!</p>
      <nuxt-link to="/frog" class="goto-link">
        Click here for fancy graphs!
      </nuxt-link>
    </section>
  </div>
</template>

<style lang="scss" scoped></style>
