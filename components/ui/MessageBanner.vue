<template>
  <div class="message-banner" :class="cardClassByType">
    <div class="message-banner__content" :aria-label="ariaLabelByType">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
type MessageType = 'information' | 'warning' | 'subtle'
const props = withDefaults(defineProps<{ messageType?: MessageType }>(), {
  messageType: 'information',
})
const cardClassByType = computed(() => `message-banner_${props.messageType}`)
const ariaLabelByType = computed(() => `Banner with ${props.messageType} message`)
</script>

<style lang="css" scoped>
.message-banner {
  position: relative;
  min-height: var(--font-size-2xl);
  --border-color: var(--color-divider);
  --background-color: var(--color-raised-bg);

  border-radius: var(--size-rounded-card);
  overflow: hidden;
  outline: 2px solid transparent;
  border: 1px solid var(--border-color);

  margin-bottom: var(--spacing-card-md);

  box-shadow: var(--shadow-card);
  background-color: var(--background-color);
  color: var(--text-color);

  line-height: 1.5;
  min-height: 0;
}

:slotted(a) {
  /* Uses active color to increase contrast */
  color: var(--color-link-active);
  text-decoration: underline;
}

.message-banner__content {
  padding: var(--spacing-card-lg) var(--spacing-card-lg) var(--spacing-card-lg)
    calc(var(--spacing-card-lg) - 0.5rem);
  border-left: 0.5rem solid var(--border-color);
}

.message-banner_warning {
  --border-color: var(--color-warning-banner-side);
  --background-color: var(--color-warning-banner-bg);
  --text-color: var(--color-warning-banner-text);
}

.message-banner_information {
  --border-color: var(--color-info-banner-side);
  --background-color: var(--color-info-banner-bg);
  --text-color: var(--color-info-banner-text);
}

.message-banner_subtle {
  --border-color: var(--color-gray);
  --background-color: var(--color-raised-bg);
  --text-color: var(--color-info-banner-text);
}
</style>
