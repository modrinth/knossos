<template>
  <span :class="'user-role ' + ' type--' + type">
    <!-- User roles -->
    <template v-if="type === 'admin'"> <ModrinthIcon /> Modrinth Team</template>
    <template v-else-if="type === 'moderator'"> <ModeratorIcon /> Moderator</template>
    <template v-else-if="type === 'creator'"><CreatorIcon /> Creator</template>
  </span>
</template>

<script setup>
import ModrinthIcon from '~/assets/images/utils/modrinth.svg'
import ModeratorIcon from '~/assets/images/utils/moderation.svg'
import CreatorIcon from '~/assets/images/utils/box.svg'

defineProps({
  type: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.user-role {
  background-color: var(--color-raised-bg);
  border: 1px solid var(--badge-color);
  border-radius: var(--radius-md);
  padding: var(--gap-xs) var(--gap-sm);
  font-weight: bold;
  width: fit-content;
  --badge-color: var(--color-gray);
  color: var(--badge-color);
  white-space: nowrap;
  display: inline-flex;
  align-items: center;

  svg {
    width: 1.1rem;
    height: 1.1rem;
    margin-right: var(--gap-xs);
  }

  &.type--closed,
  &.type--withheld,
  &.type--rejected,
  &.red {
    --badge-color: var(--color-red);
  }

  &.type--pending,
  &.type--moderator,
  &.type--processing,
  &.type--scheduled,
  &.orange {
    --badge-color: var(--color-orange);
  }

  &.type--accepted,
  &.type--admin,
  &.type--success,
  &.type--approved-general,
  &.green {
    --badge-color: var(--color-green);
  }

  &.type--creator,
  &.type--approved,
  &.blue {
    --badge-color: var(--color-blue);
  }

  &.type--unlisted,
  &.purple {
    --badge-color: var(--color-purple);
  }

  &.type--private,
  &.gray {
    --badge-color: var(--color-gray);
  }
}
</style>
