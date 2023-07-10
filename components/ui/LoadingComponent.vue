<template>
  <div v-if="loading" class="loading-box">
    <AnimatedLogo class="pulsing" />
    <p class="loading-text">Loading</p>
  </div>
  <template v-else>
    <div v-if="error !== null" class="loading-box known-errors">
      <p class="bold"><IssuesIcon /> Failed to load page.</p>
      <p>{{ error }}</p>
    </div>
    <slot v-else />
  </template>
</template>

<script setup>
import { IssuesIcon, AnimatedLogo } from 'omorphia'

defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
  error: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.loading-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-card-md);

  p {
    margin: 0;
  }
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-text {
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: var(--color-text-dark);
  margin-top: var(--spacing-card-lg);

  &::after {
    display: inline-block;
    animation: loading-ellipsis steps(1, end) 1.25s infinite;
    content: '';
  }

  @keyframes loading-ellipsis {
    0% {
      content: '';
    }
    25% {
      content: '.';
    }
    50% {
      content: '..';
    }
    75% {
      content: '...';
    }
    100% {
      content: '';
    }
  }
}

.pulsing {
  width: 5rem;
  height: 5rem;
  animation: pulsing 2s infinite ease-in-out;

  @keyframes pulsing {
    0% {
      scale: 1;
    }
    50% {
      scale: 1.125;
    }
    100% {
      scale: 1;
    }
  }
}

.bold {
  font-weight: bold;
}
</style>
