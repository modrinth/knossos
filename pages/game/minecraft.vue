<template>
  <div>
    <GameBanner game="minecraft_java" />
    <p class="hype-text">
      Discover over <span>18,000</span> Minecraft mods, modpacks, data packs, resource packs,
      shaders, and plugins hosted on Modrinth.
    </p>
    <div class="search-row">
      <div class="iconified-input">
        <label for="search-input" hidden>Search Minecraft: Java Edition projects</label>
        <SearchIcon />
        <input id="search-input" type="text" placeholder="Search Minecraft: Java Edition content" />
        <Button
          :class="notificationSearchInput ? '' : 'empty'"
          @click="() => (notificationSearchInput = '')"
        >
          <XIcon />
        </Button>
      </div>
      <PopoutMenu class="btn search-row-button">
        <FilterIcon />
        Filter...
        <template #menu> </template>
      </PopoutMenu>
    </div>
    <section v-for="i in 3" :key="i" class="featured-list">
      <div class="header">
        <h2>Mods</h2>
        <Button class="btn-rounded">View all <ChevronRightIcon /></Button>
      </div>
      <div class="project-carousel">
        <NuxtLink
          v-for="project in projects.slice(0, 4)"
          :key="project.project_id"
          class="carousel-item"
          :to="`/project/${project.project_id}`"
          :style="`--_accent-color: ${toColor(project.color)}`"
        >
          <img
            :src="
              project.featured_gallery
                ? project.featured_gallery
                : 'https://launcher-files.modrinth.com/assets/maze-bg.png'
            "
            class="preview"
            :class="{ 'has-gallery': project.featured_gallery }"
          />
          <div class="metadata">
            <Avatar class="icon" :src="project.icon_url" />
            <div class="title">
              <div class="name">{{ project.title }}</div>
              <div class="subtitle">
                by <span :to="`/user/${project.author}`">{{ project.author }}</span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
<script setup>
import {
  Button,
  ChevronRightIcon,
  PopoutMenu,
  XIcon,
  Avatar,
  SearchIcon,
  FilterIcon,
} from 'omorphia'
import GameBanner from '~/components/ui/GameBanner.vue'

const rawProjects = await useBaseFetch(`search?limit=100`, {
  method: 'GET',
})
const projects = computed(() =>
  rawProjects ? rawProjects.hits.filter((hit) => hit.featured_gallery) : []
)

function toColor(color) {
  color >>>= 0
  const b = color & 0xff
  const g = (color & 0xff00) >>> 8
  const r = (color & 0xff0000) >>> 16
  return 'rgba(' + [r, g, b, 0.3].join(',') + ')'
}
</script>
<style lang="scss" scoped>
.page-header {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  width: 100%;
  height: 10rem;

  .project-carousel {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--gap-lg);

    .carousel-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .metadata {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
        position: relative;

        .icon {
          background-color: transparent;
          border: none;
          box-shadow: none;
        }

        .name {
          grid-area: title;
          font-weight: 700;
          color: var(--color-contrast);
        }

        .subtitle {
          font-size: var(--font-size-sm);
          margin-top: 0.25rem;
        }
      }

      .preview {
        grid-area: preview;
        width: 100%;
        aspect-ratio: 2 / 1;
        border-radius: 12px;
        object-fit: cover;
        position: relative;
      }
    }
  }

  .featured-list {
    margin-top: 2rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--gap-md);

    .btn-rounded {
      border-radius: 10000px;
      border: 2px solid var(--color-base);
      color: var(--color-base);
      background-color: transparent;
      box-shadow: none;
      padding: 0.5rem 1rem;
    }

    h2 {
      margin: 0;
    }
  }

  .hype-text {
    font-size: var(--font-size-md);

    span {
      color: var(--color-brand);
      font-weight: 600;
    }
  }
}
</style>
