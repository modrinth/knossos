<template>
  <div>
    <section class="card">
      <h2>Analytics</h2>
      <p>You found a secret!</p>
      <nuxt-link to="/frog" class="goto-link"> Click here for fancy graphs! </nuxt-link>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Analytics - Modrinth',
})
</script>
