<template>
  <div class="overflow-container">
    <button
      ref="overflowButton"
      class="square-button"
      :class="{ 'raised-button': raised }"
      @click="open = !open"
    >
      <OverflowIcon />
    </button>
    <OverflowMenu ref="overflowMenu" :open="open">
      <slot />
    </OverflowMenu>
  </div>
</template>

<script setup>
import OverflowIcon from '~/assets/images/utils/more-horizontal.svg'
import OverflowMenu from '~/components/ui/OverflowMenu.vue'

defineProps({
  raised: {
    type: Boolean,
    default: false,
  },
})

const overflowButton = ref(null)
const overflowMenu = ref(null)

const open = ref(false)
</script>

<style lang="scss" scoped>
.overflow-container {
  display: contents;
}
</style>
