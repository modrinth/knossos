<template>
  <nav class="breadcrumbs" :class="{ 'empty-stack': linkStack.length === 0 }">
    <template v-for="(link, index) in linkStack" :key="index">
      <NuxtLink
        :to="link.href"
        class="breadcrumb goto-link"
        :class="{ trim: link.allowTrimming ? link.allowTrimming : false }"
      >
        {{ link.label }}
      </NuxtLink>
      <ChevronRightIcon />
    </template>
    <span class="breadcrumb">{{ currentTitle }}</span>
  </nav>
</template>

<script setup>
import ChevronRightIcon from '~/assets/images/utils/chevron-right.svg'

defineProps({
  linkStack: {
    type: Array,
    default: () => [],
  },
  currentTitle: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.breadcrumbs {
  //padding: var(--spacing-card-md) var(--spacing-card-lg);
  display: flex;
  margin-bottom: var(--spacing-card-bg);
  align-items: center;
  flex-wrap: wrap;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  a.breadcrumb {
    padding-block: var(--spacing-card-xs);

    &.trim {
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &.empty-stack {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
