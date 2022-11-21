<template>
  <span :class="'version-badge ' + color + ' type--' + type">
    <template v-if="color"
      ><span class="circle" /> {{ $capitalizeString(type) }}</template
    >
    <template v-else-if="type === 'admin'"
      ><ModrinthIcon /> Modrinth Team</template
    >
    <template v-else-if="type === 'moderator'"
      ><IconScales /> Moderator</template
    >
    <template v-else-if="type === 'creator'"><IconBox /> Creator</template>
    <template v-else-if="type === 'approved'"><IconList /> Listed</template>
    <template v-else-if="type === 'unlisted'"><IconEyeOff /> Unlisted</template>
    <template v-else-if="type === 'draft'"><IconFileText /> Draft</template>
    <template v-else-if="type === 'archived'"
      ><IconArchive /> Archived</template
    >
    <template v-else-if="type === 'rejected'"><IconCross /> Rejected</template>
    <template v-else-if="type === 'processing'"
      ><IconUpdate /> Under review</template
    >
    <template v-else
      ><span class="circle" /> {{ $capitalizeString(type) }}</template
    >
  </span>
</template>

<script>
import ModrinthIcon from '~/assets/brand/logo.svg?inline'

export default {
  name: 'Badge',
  components: { ModrinthIcon },
  props: {
    type: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.version-badge {
  display: flex;
  align-items: center;
  font-weight: bold;
  width: fit-content;
  --badge-color: var(--color-special-gray);
  color: var(--badge-color);

  .circle {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    display: inline-block;
    margin-right: 0.25rem;
    background-color: var(--badge-color);
  }

  svg {
    margin-right: 0.25rem;
  }

  &.type--rejected,
  &.red {
    --badge-color: var(--color-special-red);
  }

  &.type--moderator,
  &.type--processing,
  &.orange {
    --badge-color: var(--color-special-orange);
  }

  &.type--admin,
  &.green {
    --badge-color: var(--color-special-green);
  }

  &.type--creator,
  &.type--approved,
  &.blue {
    color: var(--color-special-blue);
  }

  &.type--unlisted,
  &.purple {
    color: var(--color-special-purple);
  }

  &.gray {
    --badge-color: var(--color-special-gray);
  }
}
</style>
