<template>
  <div class="flash-message">
    <div class="flash-message__content" :class="cardClassByType" :aria-label="ariaLabelByType">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
type FlashMessageType = 'information' | 'warning'
const props = withDefaults(defineProps<{ messageType?: FlashMessageType }>(), {
  messageType: 'information',
})
const cardClassByType = computed(() => `flash-message_${props.messageType}`)
const ariaLabelByType = computed(() => `Flash message with ${props.messageType}`)
</script>

<style lang="css" scoped>
.flash-message {
  position: relative;
  min-height: var(--font-size-2xl);

  background: var(--color-raised-bg);
  border-radius: var(--size-rounded-card);
  overflow: clip;
  outline: 2px solid transparent;

  margin-bottom: var(--spacing-card-md);

  box-shadow: var(--shadow-card);

  line-height: 1.5;
  min-height: 0;
}

:slotted(a) {
  /* Uses active color to increase contrast */
  color: var(--color-link-active);
  text-decoration: underline;
}

.flash-message__content {
  padding: var(--spacing-card-md) var(--spacing-card-lg);
}

.flash-message_warning {
  border-left: 0.5rem solid var(--color-warning-banner-side);
  background-color: var(--color-warning-banner-bg);
  color: var(--color-warning-banner-text);
}

.flash-message_information {
  border-left: 0.5rem solid var(--color-info-banner-side);
  background-color: var(--color-info-banner-bg);
  color: var(--color-info-banner-text);
}
</style>
