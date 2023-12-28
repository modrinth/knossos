<template>
  <div class="card-container">
    <div class="header-container">
      <div>Logo</div>
      <div>Meow</div>
    </div>
    <div class="card-margin">
      <Card>
        <h1>Invite</h1>
      </Card>
    </div>
    <div>Bottom Row</div>
  </div>
</template>

<script setup lang="ts">
import { Card } from 'omorphia'

definePageMeta({
  layout: false,
})
</script>

<style scoped lang="scss">
@import '~/assets/styles/global.scss';
@import 'omorphia/dist/style.css';

* {
  --max-w-sm: 32rem;
}

.card-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;

  max-width: var(--max-w-sm);
  margin-left: auto;
  margin-right: auto;

  padding: var(--gap-sm);
}

.card-margin {
  margin-top: var(--gap-sm);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
