<template>
  <article class="project-card" :style="`--_accent-color: ${toColor}`">
    <nuxt-link
      :to="`/${$getProjectTypeForUrl(type, categories)}/${id}`"
      class="project-card__link"
    ></nuxt-link>
    <div class="icon">
      <Avatar :src="iconUrl" />
    </div>
    <div class="title">
      <div class="name">{{ name }}</div>
      <nuxt-link :to="`user/${author}`" class="author">
        by
        <span>{{ author }}</span>
      </nuxt-link>
    </div>
    <Categories
      v-if="false"
      :type="type"
      :categories="categories.filter((cat) => !tags.loaders.some((loader) => loader.name === cat))"
      class="tags"
    />
    <div class="featured-gallery" :class="!featuredImage ? 'no-image' : ''">
      <img
        :src="
          featuredImage ? featuredImage : 'https://launcher-files.modrinth.com/assets/maze-bg.png'
        "
        alt="gallery image"
        loading="lazy"
      />
    </div>
    <div class="summary">{{ description }}</div>
    <div class="stats">
      <span class="stat">
        <span class="label"><DownloadIcon /></span>
        <span class="value">{{ formatNumber(downloads) }}</span>
      </span>
      <span class="stat">
        <span class="label"><HeartIcon /></span>
        <span class="value">{{ formatNumber(follows) }}</span>
      </span>
      <span class="stat">
        <span class="label">Updated</span>
        <span class="value">{{ fromNow(updatedAt) }}</span>
      </span>
    </div>
  </article>
  <article v-if="false" class="project-card" :aria-label="name" role="listitem">
    <nuxt-link
      :title="name"
      class="icon"
      tabindex="-1"
      :to="`/${$getProjectTypeForUrl(type, categories)}/${id}`"
    >
      <Avatar :src="iconUrl" :alt="name" size="md" no-shadow loading="lazy" />
    </nuxt-link>
    <nuxt-link
      class="gallery"
      :class="{ 'no-image': !featuredImage }"
      tabindex="-1"
      :to="`/${$getProjectTypeForUrl(type, categories)}/${id}`"
      :style="color ? `background-color: ${toColor};` : ''"
    >
      <img v-if="featuredImage" :src="featuredImage" alt="gallery image" loading="lazy" />
    </nuxt-link>
    <div class="title">
      <nuxt-link :to="`/${$getProjectTypeForUrl(type, categories)}/${id}`">
        <h2 class="name">
          {{ name }}
        </h2>
      </nuxt-link>
      <p v-if="author" class="author">
        by
        <nuxt-link class="title-link" :to="`/user/${author}`">
          {{ author }}
        </nuxt-link>
      </p>
      <Badge v-if="status && status !== 'approved'" :type="status" class="status" />
    </div>
    <p class="description">
      {{ description }}
    </p>
    <Categories
      :categories="
        categories.filter((x) => !hideLoaders || !tags.loaders.find((y) => y.name === x))
      "
      :type="type"
      class="tags"
    >
      <EnvironmentIndicator
        :type-only="moderation"
        :client-side="clientSide"
        :server-side="serverSide"
        :type="projectTypeDisplay"
        :search="search"
        :categories="categories"
      />
    </Categories>
    <div class="stats">
      <div v-if="downloads" class="stat">
        <DownloadIcon aria-hidden="true" />
        <p>
          <strong>{{ $formatNumber(downloads) }}</strong
          ><span class="stat-label"> download<span v-if="downloads !== '1'">s</span></span>
        </p>
      </div>
      <div v-if="follows" class="stat">
        <HeartIcon aria-hidden="true" />
        <p>
          <strong>{{ $formatNumber(follows) }}</strong
          ><span class="stat-label"> follower<span v-if="follows !== '1'">s</span></span>
        </p>
      </div>
      <div class="buttons">
        <slot />
      </div>
      <div
        v-if="showUpdatedDate"
        v-tooltip="$dayjs(updatedAt).format('MMMM D, YYYY [at] h:mm A')"
        class="stat date"
      >
        <EditIcon aria-hidden="true" />
        <span class="date-label"
          >Updated <strong>{{ fromNow(updatedAt) }}</strong></span
        >
      </div>
      <div
        v-else
        v-tooltip="$dayjs(createdAt).format('MMMM D, YYYY [at] h:mm A')"
        class="stat date"
      >
        <CalendarIcon aria-hidden="true" />
        <span class="date-label"
          >Published <strong>{{ fromNow(createdAt) }}</strong></span
        >
      </div>
    </div>
  </article>
</template>

<script>
import Categories from '~/components/ui/search/Categories.vue'
import Badge from '~/components/ui/Badge.vue'
import EnvironmentIndicator from '~/components/ui/EnvironmentIndicator.vue'

import CalendarIcon from '~/assets/images/utils/calendar.svg'
import EditIcon from '~/assets/images/utils/pen-square.svg'
import DownloadIcon from '~/assets/images/utils/download.svg'
import HeartIcon from '~/assets/images/utils/heart.svg'
import Avatar from '~/components/ui/Avatar.vue'
import { formatNumber } from '~/plugins/shorthands'

export default {
  components: {
    EnvironmentIndicator,
    Avatar,
    Categories,
    Badge,
    CalendarIcon,
    EditIcon,
    DownloadIcon,
    HeartIcon,
  },
  props: {
    id: {
      type: String,
      default: 'modrinth-0',
    },
    type: {
      type: String,
      default: 'mod',
    },
    name: {
      type: String,
      default: 'Project Name',
    },
    author: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: 'A _type description',
    },
    iconUrl: {
      type: String,
      default: '#',
      required: false,
    },
    downloads: {
      type: String,
      default: null,
      required: false,
    },
    follows: {
      type: String,
      default: null,
      required: false,
    },
    createdAt: {
      type: String,
      default: '0000-00-00',
    },
    updatedAt: {
      type: String,
      default: null,
    },
    categories: {
      type: Array,
      default() {
        return []
      },
    },
    status: {
      type: String,
      default: null,
    },
    hasModMessage: {
      type: Boolean,
      default: false,
    },
    serverSide: {
      type: String,
      required: false,
      default: '',
    },
    clientSide: {
      type: String,
      required: false,
      default: '',
    },
    moderation: {
      type: Boolean,
      required: false,
      default: false,
    },
    search: {
      type: Boolean,
      required: false,
      default: false,
    },
    featuredImage: {
      type: String,
      required: false,
      default: null,
    },
    showUpdatedDate: {
      type: Boolean,
      required: false,
      default: true,
    },
    hideLoaders: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: Number,
      required: false,
      default: null,
    },
  },
  setup() {
    const tags = useTags()

    return { tags }
  },
  computed: {
    projectTypeDisplay() {
      return this.$getProjectTypeForDisplay(this.type, this.categories)
    },
    toColor() {
      let color = this.color

      color >>>= 0
      const b = color & 0xff
      const g = (color & 0xff00) >>> 8
      const r = (color & 0xff0000) >>> 16

      // Convert RGB to HSL
      const hsl = this.rgbToHsl(r, g, b)

      // Extract HSL components
      const h = hsl[0]
      const s = hsl[1]
      const l = Math.min(hsl[2], 50)

      return 'hsl(' + [h, s + '%', l + '%'].join(',') + ')'
    },
  },
  methods: {
    formatNumber,
    rgbToHsl: (r, g, b) => {
      r /= 255
      g /= 255
      b /= 255

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h
      let s
      const l = (max + min) / 2

      if (max === min) {
        h = s = 0 // achromatic
      } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0)
            break
          case g:
            h = (b - r) / d + 2
            break
          case b:
            h = (r - g) / d + 4
            break
        }
        h /= 6
      }

      return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
    },
  },
}
</script>

<style lang="scss" scoped>
.project-card {
  display: grid;
  gap: 0.5rem 0.75rem;
  grid-template: 'icon title gallery' 'icon summary gallery' 'icon stats gallery';
  grid-template-columns: min-content 1fr auto;
  grid-template-rows: min-content auto 1fr;
  position: relative;
  padding: 1rem;
  //padding-left: calc(1rem + 6px);
  border-radius: 10px;
  overflow: hidden;
  background-color: var(--color-raised-bg);
  border: 1px solid var(--color-button-bg);
  height: 8rem;

  > div {
    z-index: 1;
  }

  *:not(a, button, .project-card__link) {
    pointer-events: none;
  }

  &::before {
    content: '';
    inset: 0;
    background-image: linear-gradient(-90deg, transparent 97%, var(--_accent-color));
    position: absolute;
    opacity: 0;
    border-radius: inherit;
    filter: brightness(1) saturate(1);
  }

  &::after {
    content: '';
    inset: 0;
    background-color: transparent;
    position: absolute;
    opacity: 0.5;
    //border-left: 6px solid var(--_accent-color);
  }

  &:has(.project-card__link:active):not(:has(a:not(.project-card__link):active)) {
    scale: 0.99 !important;
  }

  //a:not(.project-card__link) {
  //  z-index: 10;
  //  position: absolute;
  //  left: 20rem;
  //}
}

.project-card__link {
  position: absolute;
  inset: 0;
  cursor: pointer;
  z-index: 1;
  border-radius: inherit;

  &:focus-visible {
    border: 2px solid white;
  }
}

.icon {
  --_size: 6rem;
  grid-area: icon;
  width: var(--_size);
  height: var(--_size);
  box-shadow: none;
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  border: 1px solid var(--color-button-bg);
  background-color: var(--color-raised-bg);

  .avatar {
    --size: var(--_size);
    background-color: transparent;
    border: none;
    box-shadow: none;
    border-radius: inherit;
  }
}

.title {
  grid-area: title;
  display: flex;
  flex-direction: row;
  gap: 0.3em;
  align-items: baseline;
}

.name {
  font-weight: 700;
  color: var(--color-contrast);
  font-size: var(--font-size-md);
}

.author {
  font-size: var(--font-size-sm);

  a {
    color: var(--color-link) !important;
  }
}

.stats {
  display: flex;
  gap: 0.5rem 1rem;
  flex-wrap: wrap;
  grid-area: stats;
  margin-top: auto;
  margin-bottom: -2px;

  .stat {
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    justify-content: center;
    line-height: 1em;

    .label {
      color: var(--color-secondary);
    }

    .value {
      font-weight: 500;
    }
  }
}

.summary {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.25rem;
  height: 2.5rem;
  font-size: var(--font-size-sm);
  grid-area: summary;
  color: var(--color-text-secondary);
}

.tags {
  grid-area: tags;
}

.featured-gallery {
  display: flex;
  grid-area: gallery;
  align-items: center;
  height: 100%;

  img {
    margin-left: auto;
    aspect-ratio: 2 / 1;
    object-fit: cover;
    border-radius: 15px;
    height: 100%;
    border: 4px solid var(--color-button-bg);
  }

  &.no-image img {
    //opacity: 0;
  }
}
</style>
