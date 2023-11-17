<template>
  <div v-if="count > 1" class="columns paginates">
    <a
      :class="{ disabled: page === 1 }"
      :tabindex="page === 1 ? -1 : 0"
      class="left-arrow paginate has-icon btn button-transparent square-button"
      aria-label="Previous Page"
      :href="linkFunction(page - 1)"
      @click.prevent="page !== 1 ? switchPage(page - 1) : null"
    >
      <LeftArrowIcon />
    </a>
    <div
      v-for="(item, index) in pages"
      :key="'page-' + item + '-' + index"
      :class="{
        'page-number': page !== item,
        shrink: item > 99,
      }"
      class="page-number-container"
    >
      <div v-if="item === '-'" class="has-icon">
        <GapIcon class="gap-icon" />
      </div>
      <a
        v-else
        class="btn"
        :class="{
          'page-number current btn-primary': page === item,
          'button-transparent': page !== item,
          shrink: item > 99,
        }"
        :href="linkFunction(item)"
        @click.prevent="page !== item ? switchPage(item) : null"
      >
        {{ item }}
      </a>
    </div>

    <a
      :class="{
        disabled: page === pages[pages.length - 1],
      }"
      :tabindex="page === pages[pages.length - 1] ? -1 : 0"
      class="right-arrow paginate has-icon btn button-transparent square-button"
      aria-label="Next Page"
      :href="linkFunction(page + 1)"
      @click.prevent="page !== pages[pages.length - 1] ? switchPage(page + 1) : null"
    >
      <RightArrowIcon />
    </a>
  </div>
</template>

<script>
import GapIcon from '~/assets/images/utils/gap.svg'
import LeftArrowIcon from '~/assets/images/utils/left-arrow.svg'
import RightArrowIcon from '~/assets/images/utils/right-arrow.svg'

export default {
  components: {
    GapIcon,
    LeftArrowIcon,
    RightArrowIcon,
  },
  props: {
    page: {
      type: Number,
      default: 1,
    },
    count: {
      type: Number,
      default: 1,
    },
    linkFunction: {
      type: Function,
      default() {
        return () => '/'
      },
    },
  },
  emits: ['switch-page'],
  computed: {
    pages() {
      let pages = []

      if (this.count > 7) {
        if (this.page + 3 >= this.count) {
          pages = [
            1,
            '-',
            this.count - 4,
            this.count - 3,
            this.count - 2,
            this.count - 1,
            this.count,
          ]
        } else if (this.page > 5) {
          pages = [1, '-', this.page - 1, this.page, this.page + 1, '-', this.count]
        } else {
          pages = [1, 2, 3, 4, 5, '-', this.count]
        }
      } else {
        pages = Array.from({ length: this.count }, (_, i) => i + 1)
      }

      return pages
    },
  },
  methods: {
    switchPage(newPage) {
      this.$emit('switch-page', newPage)
      if (newPage !== null && newPage !== '' && !isNaN(newPage)) {
        this.$emit('switch-page', Math.min(Math.max(newPage, 1), this.count))
      }
    },
  },
}
</script>

<style scoped lang="scss">
a {
  padding: var(--gap-sm);
  margin: 0;
  height: 2.25rem;
  min-width: 2.25rem;
  box-shadow: none;
}

.button-transparent {
  color: var(--color-text);
}

.btn-primary {
  color: var(--color-brand);
  background-color: var(--color-brand-highlight);
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
  margin: 0.5rem 0;
  display: flex;
  gap: var(--gap-xs);
}

.left-arrow {
  margin-left: auto !important;
}

.right-arrow {
  margin-right: auto !important;
}

@media screen and (max-width: 400px) {
  .paginates {
    font-size: 80%;
  }
}

@media screen and (max-width: 530px) {
  a {
    width: 2.5rem;
    padding: 0.5rem 0;
  }
}

.gap-icon {
  margin-inline: 0.25rem;
}
</style>
