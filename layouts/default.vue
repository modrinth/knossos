<template>
  <div>
    <div class="raised-bg-wrapper">
      <Header />
    </div>
    <div class="container content">123</div>
    <footer class="container">
      <!-- Column 1: Text logo -->
      <!-- Column 1: Copyright -->

      <!-- Column 2+3: FOSS disclaimer -->

      <!-- Column 2: Navigation links -->

      <!-- Column 3: Social links -->
      <!-- Column 3: Legal links -->
    </footer>
  </div>
</template>

<script>
import Header from '@/components/Header'

export default {
  components: {
    Header,
  },
}
</script>

<style lang="scss" scoped>
.content {
  // Q: Why not `padding: 1rem inherit`?
  // A: Because global values like inherit don't work for `padding: x y`; only for `padding: a`;
  padding-bottom: 1rem;
  padding-top: 1rem;
}
</style>
