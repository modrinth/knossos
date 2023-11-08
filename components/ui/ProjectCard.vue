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
      <span v-tooltip="`${formatNumber(downloads, false)} downloads`" class="stat">
        <span class="label"><DownloadIcon /></span>
        <span class="value">{{ formatNumber(downloads) }}</span>
      </span>
      <span v-tooltip="`${formatNumber(follows, false)} followers`" class="stat">
        <span class="label"><HeartIcon /></span>
        <span class="value">{{ formatNumber(follows) }}</span>
      </span>
      <span v-tooltip="$dayjs(updatedAt).format('MMMM D, YYYY [at] h:mm A')" class="stat">
        <span class="label">Updated</span>
        <span class="value">{{ fromNow(updatedAt) }}</span>
      </span>
    </div>
    <div class="actions">
      <button v-tooltip="`Follow`" class="btn icon-only">
        <HeartIcon />
      </button>
      <OverflowMenu
        class="btn icon-only"
        position="bottom"
        direction="right"
        :options="[
          {
            id: 'download',
            color: 'green',
            hoverFilledOnly: true,
            action: () => {
              router.push(`/${$getProjectTypeForUrl(type, categories)}/${id}/versions`)
            },
          },
          {
            id: 'save',
            action: () => {},
          },
          {
            id: 'gallery',
            action: () => {
              router.push(`/${$getProjectTypeForUrl(type, categories)}/${id}/gallery`)
            },
          },
          {
            id: 'versions',
            action: () => {
              router.push(`/${$getProjectTypeForUrl(type, categories)}/${id}/versions`)
            },
          },
        ]"
      >
        <MoreHorizontalIcon />
        <template #download> <DownloadIcon /> Download </template>
        <template #save> <BookmarkIcon /> Save </template>
        <template #gallery> <ImageIcon /> View gallery </template>
        <template #versions> <VersionIcon /> View versions </template>
      </OverflowMenu>
    </div>
  </article>
</template>

<script>
import {
  HeartIcon,
  DownloadIcon,
  MoreHorizontalIcon,
  ImageIcon,
  VersionIcon,
  OverflowMenu,
} from 'omorphia'
import Categories from '~/components/ui/search/Categories.vue'
import BookmarkIcon from '~/assets/images/utils/bookmark.svg'

import Avatar from '~/components/ui/Avatar.vue'
import { formatNumber } from '~/plugins/shorthands.js'

export default {
  components: {
    Avatar,
    Categories,
    DownloadIcon,
    HeartIcon,
    MoreHorizontalIcon,
    OverflowMenu,
    BookmarkIcon,
    ImageIcon,
    VersionIcon,
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
    const router = useRouter()

    return { tags, router }
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
  grid-template: 'icon title actions gallery' 'icon summary actions gallery' 'icon stats actions gallery';
  grid-template-columns: min-content 1fr min-content auto;
  grid-template-rows: min-content auto 1fr;
  position: relative;
  padding: 1rem;
  //padding-left: calc(1rem + 6px);
  border-radius: 10px;
  background-color: var(--color-raised-bg);
  border: 1px solid var(--color-button-bg);

  *:not(a, button, .project-card__link) {
    pointer-events: none;
  }

  &:has(.project-card__link:active):not(:has(a:not(.project-card__link):active)) {
    scale: 0.99 !important;
  }
}

.project-card__link {
  position: absolute;
  inset: 0;
  cursor: pointer;
  border-radius: inherit;

  &:focus-visible {
    outline: 0.25rem solid #ea80ff;
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
    pointer-events: all;
    cursor: text;

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
  justify-content: flex-end;
  height: 6rem;

  img {
    object-fit: cover;
    border-radius: 15px;
    //width: 100%;
    //max-width: 100%;
    height: 100%;
    width: auto;
    aspect-ratio: 2 / 1;
    border: 4px solid var(--color-button-bg);
  }

  &.no-image img {
    //opacity: 0;
  }
}

.actions {
  grid-area: actions;
  display: flex;
  gap: var(--gap-xs);
  width: fit-content;
  margin-left: auto;
  transition: opacity 0.25s ease-in-out;
  height: fit-content;

  @media (hover: hover) {
    opacity: 0;
  }

  :deep(.popup-menu) {
    z-index: 20;
  }
}

@media (hover: hover) {
  .project-card:hover,
  .project-card:focus-within {
    .actions {
      opacity: 1;
    }
  }
}
</style>
