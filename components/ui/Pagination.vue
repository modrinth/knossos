<template>
  <div v-if="count > 1" class="columns paginates">
    <a
      :class="{ disabled: page === 1 }"
      :tabindex="page === 1 ? -1 : 0"
      class="btn btn-transparent icon-only"
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
        'desktop-only': page - 1 !== item && page + 1 !== item && item !== page,
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
          'page-number current btn-highlighted': page === item,
          'btn-transparent': page !== item,
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
      class="btn btn-transparent icon-only"
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
      const pages = []
      const fourFromStart = 4
      const fourFromEnd = this.count - 3

      pages.push(1)

      if (this.page <= fourFromStart) {
        pages.push(2, 3, 4, 5)
      }

      if (this.page > fourFromStart) {
        pages.push('-')
      }

      if (this.page > fourFromStart && this.page < fourFromEnd) {
        pages.push(this.page - 1, this.page, this.page + 1)
      }

      if (this.page < fourFromEnd) {
        pages.push('-')
      }

      if (this.page >= fourFromEnd) {
        pages.push(this.count - 4, this.count - 3, this.count - 2, this.count - 1)
      }

      pages.push(this.count)

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
  display: flex;
  gap: var(--gap-xs);
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

@media screen and (max-width: 500px) {
  .paginates {
    font-size: 80%;
  }

  .desktop-only {
    display: none;
  }
}
</style>
