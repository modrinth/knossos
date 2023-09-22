<script setup>
import {Avatar, Button, Card, ShareIcon, BoxIcon} from "omorphia";
</script>

<template>
  <div class="members">
    <Card v-for="ignored in 10" class="member-card">
      <Avatar class="member-icon" src="https://avatars.githubusercontent.com/u/83074853?v=4" circle/>
      <h3> CodexAdrian </h3>
      <div class="markdown-body">
        <p> title </p>
      </div>
    </Card>
  </div>
</template>

<style scoped lang="scss">
.member-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4.5rem;
  margin-bottom: 0;

  .member-icon {
    --size: 5rem !important;
    flex-shrink: 0;
    position: absolute;
    top: -4.25rem;
  }
}

.members {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--gap-md);
}
</style>
