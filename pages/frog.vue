<template>
  <div class="card">
    <h1>Frog</h1>
    <p>You've been frogged! 🐸</p>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0&autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    <br>
    <img
      src="https://cdn.modrinth.com/frog.png"
      alt="a photorealistic painting of a frog labyrinth"
    />
    <Promotion />
    <Promotion />
    <Promotion />
    <Promotion />
    <Promotion />
    <Promotion />
    <Promotion />
  </div>
</template>
<script setup>
import Promotion from "~/components/ads/Promotion.vue";
</script>
<style lang="scss" scoped>
.card {
  width: calc(100% - 2 * var(--spacing-card-md));
  max-width: 1280px;
  margin-inline: auto;
  text-align: center;
  box-sizing: border-box;
  margin-block: var(--spacing-card-md);
}

img {
  margin-block: 0 1.5rem;
  width: 60%;
  max-width: 40rem;
}
</style>
