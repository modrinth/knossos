<template>
  <span :class="'version-badge ' + type">
    <span class="circle" /> {{ type }}
  </span>
</template>

<script>
export default {
  name: 'VersionBadge',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.version-badge {
  display: flex;
  align-items: center;
  font-weight: bold;
  text-transform: capitalize;

  .circle {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    display: inline-block;
    margin-right: 0.25rem;
  }

  &.alpha {
    color: var(--color-badge-red-text);

    .circle {
      background-color: var(--color-badge-red-bg);
    }
  }

  &.release {
    color: var(--color-badge-green-text);

    .circle {
      background-color: var(--color-badge-green-bg);
    }
  }

  &.beta {
    color: var(--color-badge-yellow-text);

    .circle {
      background-color: var(--color-badge-yellow-bg);
    }
  }
}
</style>
