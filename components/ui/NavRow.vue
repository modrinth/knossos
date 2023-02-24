<template>
  <nav class="navigation">
    <NuxtLink
      v-for="(link, index) in filteredLinks"
      v-show="link.shown === undefined ? true : link.shown"
      :key="index"
      ref="linkElements"
      :to="query ? (link.href ? `?${query}=${link.href}` : '?') : link.href"
      class="nav-link button-animation"
    >
      <span>{{ link.label }}</span>
    </NuxtLink>
    <div class="nav-indicator" :style="{ left: positionToMove, width: sliderWidth }"></div>
  </nav>
</template>

<script>
export default {
  props: {
    links: {
      default: () => [],
      type: Array,
    },
    query: {
      default: null,
      type: String,
    },
  },
  data() {
    return {
      sliderPosition: 0,
      selectedElementWidth: 0,
      activeIndex: -1,
      oldIndex: -1,
    }
  },
  computed: {
    filteredLinks() {
      return this.links.filter((x) => (x.shown === undefined ? true : x.shown))
    },
    positionToMove() {
      return `${this.sliderPosition}px`
    },
    sliderWidth() {
      return `${this.selectedElementWidth}px`
    },
  },
  watch: {
    '$route.path': {
      handler() {
        this.pickLink()
      },
    },
    '$route.query': {
      handler() {
        if (this.query) this.pickLink()
      },
    },
  },
  mounted() {
    this.pickLink()
  },
  methods: {
    pickLink() {
      this.activeIndex = this.query
        ? this.filteredLinks.findIndex(
            (x) => (x.href === '' ? undefined : x.href) === this.$route.path[this.query]
          )
        : this.filteredLinks.findIndex((x) => x.href === decodeURIComponent(this.$route.path))

      if (this.activeIndex !== -1) {
        this.startAnimation()
      } else {
        this.oldIndex = -1
        this.sliderPosition = 0
        this.selectedElementWidth = 0
      }
    },
    startAnimation() {
      const el = this.$refs.linkElements[this.activeIndex].$el
      this.sliderPosition = el.offsetLeft
      this.selectedElementWidth = el.offsetWidth
    },
  },
}
</script>

<style lang="scss" scoped>
.navigation {
  display: flex;
  flex-direction: row;
  align-items: center;
  grid-gap: 1rem;
  flex-wrap: wrap;
  position: relative;

  .nav-link {
    text-transform: capitalize;
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
    position: relative;

    &:hover {
      color: var(--color-text);

      &::after {
        opacity: 0.4;
      }
    }

    &:active::after {
      opacity: 0.2;
    }

    &.router-link-exact-active {
      color: var(--color-text);

      &::after {
        opacity: 1;
      }
    }
  }

  &.use-animation {
    .nav-link {
      &.is-active::after {
        opacity: 0;
      }
    }
  }

  .nav-indicator {
    position: absolute;
    height: 0.25rem;
    bottom: -5px;
    left: 0;
    margin: auto;
    width: 3rem;
    transition: all ease 0.5s;
    border-radius: var(--size-rounded-max);
    background-color: var(--color-brand);

    @media (prefers-reduced-motion) {
      transition: none !important;
    }
  }
}
</style>
