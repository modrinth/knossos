<template>
  <div>
    <div
      :class="{ shown: shown }"
      class="popup-overlay"
      @click="shown = false"
    />
    <div class="popup-body" :class="{ shown: shown }">
      <div v-if="header" class="header">
        <h1>{{ header }}</h1>
        <button
          class="iconified-button icon-only transparent"
          @click="shown = false"
        >
          <CrossIcon />
        </button>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import CrossIcon from '~/assets/images/utils/x.svg?inline'

export default {
  name: 'Popup',
  components: {
    CrossIcon,
  },
  props: {
    header: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      shown: false,
    }
  },
  methods: {
    show() {
      this.shown = true
    },
    hide() {
      this.shown = false
    },
  },
}
</script>

<style lang="scss" scoped>
.popup-overlay {
  visibility: hidden;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;

  transition: all 0.3s ease-in-out;

  &.shown {
    opacity: 1;
    visibility: visible;
    background: hsla(0, 0%, 0%, 0.5);
    backdrop-filter: blur(3px);
  }
}

.popup-body {
  position: fixed;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 21;
  box-shadow: var(--shadow-raised), var(--shadow-inset);
  border-radius: var(--size-rounded-lg);
  max-height: 80%;
  overflow-y: auto;
  width: 600px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--color-button-bg);
    padding: var(--spacing-card-md) var(--spacing-card-lg);

    h1 {
      font-size: 1.25rem;
    }
  }

  .content {
    background-color: var(--color-raised-bg);
  }

  top: calc(100% + 400px);
  visibility: hidden;
  opacity: 0;
  transition: all 0.25s ease-in-out;

  &.shown {
    opacity: 1;
    visibility: visible;
    top: 50%;
  }
}
</style>
