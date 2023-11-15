<template>
  <div class="scrollable-pane-wrapper">
    <div class="iconified-input">
      <label for="search-input" hidden>Search Minecraft: Java Edition projects</label>
      <input id="search-input" type="text" placeholder="Search versions" />
      <Button
        :class="notificationSearchInput ? '' : 'empty'"
        @click="() => (notificationSearchInput = '')"
      >
        <XIcon />
      </Button>
    </div>
    <div
      class="wrapper-wrapper"
      :class="{
        'top-fade': !scrollableAtTop,
        'bottom-fade': !scrollableAtBottom,
      }"
    >
      <div class="scrollable-pane" @scroll="onScroll">
        <Checkbox
          v-for="version in showSnapshots
            ? tags.gameVersions
            : tags.gameVersions.filter((it) => it.version_type === 'release')"
          :key="`version-filter-${version.version}`"
          :model-value="selectedOptions.includes(version)"
          :description="version.version"
          @update:model-value="() => selectedOptions[version]"
        >
          {{ version.version }}
        </Checkbox>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Button, XIcon } from 'omorphia'
import Checkbox from '~/components/ui/Checkbox.vue'

defineProps({
  options: {
    type: Array,
    required: true,
  },
})

const tags = useTags()

const selectedOptions = ref([])

const scrollableAtTop = ref(true)
const scrollableAtBottom = ref(false)

function onScroll({ target: { scrollTop, offsetHeight, scrollHeight } }) {
  scrollableAtBottom.value = Math.ceil(scrollTop + offsetHeight) >= scrollHeight

  scrollableAtTop.value = scrollTop === 0
}
</script>

<style lang="scss" scoped>
.scrollable-pane-wrapper {
  display: flex;
  flex-direction: column;
  height: 19rem;
  position: relative;
  margin-bottom: 1rem;
}

.wrapper-wrapper {
  flex-grow: 1;
  display: flex;
  overflow: hidden;
  position: relative;
  --_fade-height: 3.5rem;

  &.top-fade::before,
  &.bottom-fade::after {
    opacity: 1;
  }

  &::before,
  &::after {
    content: '';
    left: 0;
    right: 1rem;
    opacity: 0;
    position: absolute;
    pointer-events: none;
    transition: opacity 0.125s ease;
    height: var(--_fade-height);
    z-index: 1;
  }

  &::before {
    top: 0;
    background-image: linear-gradient(var(--color-raised-bg), transparent);
  }

  &::after {
    bottom: 0;
    background-image: linear-gradient(transparent, var(--color-raised-bg) 90%);
  }
}

.scrollable-pane {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 0.5rem;

  height: 100%;
  width: 100%;
  overflow-y: scroll;
  position: relative;

  > :first-child {
    margin-top: 0.5rem;
  }
}

.iconified-input {
  font-size: var(--font-size-sm);

  input {
    min-height: 2rem;
    padding-left: 0.75rem;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
}
</style>
