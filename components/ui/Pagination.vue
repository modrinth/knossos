<template>
  <div v-if="pages.length > 1" class="columns paginates">
    <a
      :class="{ disabled: currentPage === 1 }"
      class="left-arrow paginate has-icon"
      aria-label="Previous Page"
      :href="linkFunction(currentPage - 1)"
      @click.prevent="currentPage !== 1 ? switchPage(currentPage - 1) : null"
    >
      <LeftArrowIcon />
    </a>
    <div
      v-for="(item, index) in pages"
      :key="'page-' + item + '-' + index"
      :class="{
        'page-number': currentPage !== item,
        shrink: item > 99,
      }"
      class="page-number-container"
    >
      <div v-if="item === '-'" class="has-icon">
        <GapIcon />
      </div>
      <a
        v-else
        :class="{
          'page-number current': currentPage === item,
          shrink: item > 99,
        }"
        :href="linkFunction(item)"
        @click.prevent="currentPage !== item ? switchPage(item) : null"
      >
        {{ item }}
      </a>
    </div>

    <a
      :class="{
        disabled: currentPage === pages[pages.length - 1],
      }"
      class="right-arrow paginate has-icon"
      aria-label="Next Page"
      :href="linkFunction(currentPage + 1)"
      @click.prevent="
        currentPage !== pages[pages.length - 1]
          ? switchPage(currentPage + 1)
          : null
      "
    >
      <RightArrowIcon />
    </a>
  </div>
</template>

<script>
import GapIcon from '~/assets/images/utils/gap.svg?inline'
import LeftArrowIcon from '~/assets/images/utils/left-arrow.svg?inline'
import RightArrowIcon from '~/assets/images/utils/right-arrow.svg?inline'

export default {
  name: 'Pagination',
  components: {
    GapIcon,
    LeftArrowIcon,
    RightArrowIcon,
  },
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    pages: {
      type: Array,
      default() {
        return []
      },
    },
    linkFunction: {
      type: Function,
      default() {
        return () => '/'
      },
    },
  },
  methods: {
    switchPage(newPage) {
      this.$emit('switch-page', newPage)
    },
  },
}
</script>

<style scoped lang="scss">
a {
  color: var(--color-button-text);
  box-shadow: var(--shadow-raised), var(--shadow-inset);

  padding: 0.5rem 1rem;
  margin: 0;
  border-radius: 2rem;
  background: var(--color-raised-bg);

  transition: opacity 0.5s ease-in-out, filter 0.2s ease-in-out,
    transform 0.05s ease-in-out, outline 0.2s ease-in-out;

  &.page-number.current {
    background: var(--color-brand);
    color: var(--color-brand-inverted);
    cursor: default;
  }

  &.paginate.disabled {
    background-color: transparent;
    cursor: not-allowed;
    filter: grayscale(50%);
    opacity: 0.5;
  }

  &:hover:not(&:disabled) {
    filter: brightness(0.85);
  }

  &:active:not(&:disabled) {
    transform: scale(0.95);
    filter: brightness(0.8);
  }
}

.has-icon {
  display: flex;
  align-items: center;
  svg {
    width: 1em;
  }
}

.page-number-container,
a,
.has-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.paginates {
  height: 2em;
  margin: 0.5rem 0;
  > div,
  .has-icon {
    margin: 0 0.3em;
  }
  font-size: 80%;
  @media screen and (min-width: 350px) {
    font-size: 100%;
  }
}

.left-arrow {
  margin-left: auto !important;
}

.right-arrow {
  margin-right: auto !important;
}
</style>
