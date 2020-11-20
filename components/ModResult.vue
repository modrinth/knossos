<template>
  <div class="result rows">
    <img
      class="result-icon"
      :src="iconUrl ? iconUrl : 'https://cdn.modrinth.com/placeholder.svg'"
      :alt="name"
    />
    <div class="rows result-name-author">
      <h2 class="mod-name">
        <a :href="pageUrl">{{ name }}</a>
      </h2>
      <p v-if="author" class="author">
        by <a :href="authorUrl">{{ author }}</a>
      </p>
    </div>
    <p class="result-summary">
      {{ description }}
    </p>
    <div class="column-grow-1 columns result-infos">
      <div class="result-image columns">
        <DownloadIcon />
        <p>{{ formatNumber(downloads) }}</p>
      </div>
      <div
        v-tooltip="
          $dayjs(createdAt).format('[Created on] YYYY-MM-DD [at] HH:mm A')
        "
        class="result-image columns"
      >
        <CalendarIcon />
        <p>{{ $dayjs(createdAt).fromNow() }}</p>
      </div>
      <div
        v-if="updatedAt"
        v-tooltip="
          $dayjs(updatedAt).format('[Updated on] YYYY-MM-DD [at] HH:mm A')
        "
        class="result-image columns"
      >
        <EditIcon />
        <p>{{ $dayjs(updatedAt).fromNow() }}</p>
      </div>
      <div class="result-image columns">
        <TagIcon />
        <p>{{ latestVersion }}</p>
      </div>
    </div>
    <div class="categories">
      <p v-if="categories.includes('fabric')">
        <FabricLoader />
        Fabric
      </p>
      <p v-if="categories.includes('forge')">
        <ForgeLoader />
        Forge
      </p>
      <p v-if="categories.includes('technology')">
        <TechCategory />
        Technology
      </p>
      <p v-if="categories.includes('adventure')">
        <AdventureCategory />
        Adventure
      </p>
      <p v-if="categories.includes('magic')">
        <MagicCategory />
        Magic
      </p>
      <p v-if="categories.includes('utility')">
        <UtilityCategory />
        Utility
      </p>
      <p v-if="categories.includes('decoration')">
        <DecorationCategory />
        Decoration
      </p>
      <p v-if="categories.includes('library')">
        <LibraryCategory />
        Library
      </p>
      <p v-if="categories.includes('cursed')">
        <CursedCategory />
        Cursed
      </p>
      <p v-if="categories.includes('worldgen')">
        <WorldGenCategory />
        Worldgen
      </p>
      <p v-if="categories.includes('storage')">
        <StorageCategory />
        Storage
      </p>
      <p v-if="categories.includes('food')">
        <FoodCategory />
        Food
      </p>
      <p v-if="categories.includes('equipment')">
        <EquipmentCategory />
        Equipment
      </p>
      <p v-if="categories.includes('misc')">
        <MiscCategory />
        Misc
      </p>
    </div>
  </div>
</template>

<script>
import CalendarIcon from '~/assets/images/utils/calendar.svg?inline'
import DownloadIcon from '~/assets/images/utils/download.svg?inline'
import EditIcon from '~/assets/images/utils/edit.svg?inline'
import TagIcon from '~/assets/images/utils/tag.svg?inline'

import TechCategory from '~/assets/images/categories/tech.svg?inline'
import AdventureCategory from '~/assets/images/categories/adventure.svg?inline'
import CursedCategory from '~/assets/images/categories/cursed.svg?inline'
import DecorationCategory from '~/assets/images/categories/decoration.svg?inline'
import EquipmentCategory from '~/assets/images/categories/equipment.svg?inline'
import FoodCategory from '~/assets/images/categories/food.svg?inline'
import LibraryCategory from '~/assets/images/categories/library.svg?inline'
import MagicCategory from '~/assets/images/categories/magic.svg?inline'
import MiscCategory from '~/assets/images/categories/misc.svg?inline'
import StorageCategory from '~/assets/images/categories/storage.svg?inline'
import UtilityCategory from '~/assets/images/categories/utility.svg?inline'
import WorldGenCategory from '~/assets/images/categories/worldgen.svg?inline'

import ForgeLoader from '~/assets/images/categories/forge.svg?inline'
import FabricLoader from '~/assets/images/categories/fabric.svg?inline'

export default {
  name: 'ModResult',
  components: {
    TechCategory,
    AdventureCategory,
    CursedCategory,
    DecorationCategory,
    EquipmentCategory,
    FoodCategory,
    LibraryCategory,
    MagicCategory,
    MiscCategory,
    StorageCategory,
    UtilityCategory,
    WorldGenCategory,
    ForgeLoader,
    FabricLoader,
    CalendarIcon,
    DownloadIcon,
    EditIcon,
    TagIcon,
  },
  props: {
    id: {
      type: String,
      default: 'modrinth-0',
    },
    name: {
      type: String,
      default: 'Mod Name',
    },
    author: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: 'A mod description',
    },
    pageUrl: {
      type: String,
      default: '#',
    },
    authorUrl: {
      type: String,
      default: '#',
    },
    iconUrl: {
      type: String,
      default: '#',
    },
    downloads: {
      type: String,
      default: '0',
    },
    createdAt: {
      type: String,
      default: '0000-00-00',
    },
    updatedAt: {
      type: String,
      default: null,
    },
    latestVersion: {
      type: String,
      default: 'None',
    },
    categories: {
      type: Array,
      default() {
        return []
      },
    },
  },
  methods: {
    formatNumber(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
  },
}
</script>

<style lang="scss" scoped>
.results {
  margin-top: 0.75rem;
}

.result {
  display: grid;
  grid-template-columns: 7.5rem auto;
  grid-template-rows: auto auto auto 30px;
  max-width: 100vw;
  margin-bottom: var(--spacing-card-md);
  @extend %card;
}

.result * {
  object-fit: contain;
  margin-bottom: 0;
  margin-top: 0;
}

.result-icon {
  width: 6rem;
  height: 6rem;
  margin: 0.75rem;
  border-radius: var(--size-rounded-icon);
  grid-row-start: 1;
  grid-row-end: 4;
  grid-column-start: 1;
}

.result-name-author {
  display: block;
  margin-top: 10px;
}

.result-summary {
  grid-row: 2;
  grid-column: 2;
  max-height: 150px;
  font-size: 11pt;
  margin: auto 0;
}

.mod-name {
  align-self: flex-end;
  font-size: 16pt !important;
}

.author {
  margin-bottom: 2px !important;
  align-self: flex-end;
  font-size: 12pt;
}

.result-infos {
  display: grid;
  grid-template-columns: 115px 115px auto;
  grid-template-rows: 20px 20px;
  margin-top: 5px;
  grid-column: 2;
  align-items: flex-start;
  align-self: flex-start;

  .columns:nth-child(2) {
    grid-column: 1;
  }

  .columns:nth-child(3) {
    grid-column: 2;
    grid-row: 1;
  }

  .result-image {
    p {
      font-size: 10pt;
    }

    svg {
      width: 14px;
      height: 14px;
    }
  }
}

.result-image svg {
  width: 15px;
  height: 15px;
  align-self: center;
}

.result-image p {
  margin-left: 5px;
  margin-right: 15px;
  font-size: 15px;
  align-self: center;
}

.categories {
  display: flex;
  flex-direction: row;
  grid-column: 1;
  margin: 0 0 auto;
}

.categories p {
  display: flex;
  align-items: center;
  flex-direction: row;
  background-color: var(--color-category-bg);
  border-radius: var(--size-rounded-max);
  color: var(--color-category-text);
  margin: 0 5px;
  padding: 0.5rem;
  font-size: 15px;

  svg {
    width: 15px;
    margin-right: 5px;
  }
}

// Larger tablet-sized screens
@media screen and (min-width: 900px) {
  .result {
    grid-template-rows: auto auto 35px;
  }

  .result-infos {
    display: flex;
    align-items: center;
    margin-top: 0;
    .result-image {
      p {
        font-size: 15px;
      }

      svg {
        width: 15px;
        height: 15px;
      }
    }
  }

  .loaders {
    svg {
      width: 20px;
    }
  }

  .categories {
    margin: 0 0 10px 0;
  }

  .result-name-author {
    display: flex;
    margin-top: 0;
    .author {
      margin-left: 5px;
    }
  }

  .mod-name {
    font-size: 18pt;
  }

  .result-summary {
    max-height: 100px;
    font-size: 13pt;
  }
}

// Larger screens
@media screen and (min-width: 1375px) {
  .result {
    grid-column: 1;
  }

  .categories {
    margin: 0 0.5rem 0.5rem auto;
    grid-row: 3;
    grid-column: 3;
  }

  .mod-name {
    font-size: 20pt;
  }
}

// Desktop
@media screen and (min-width: 1500px) {
  .result-name-author {
    display: flex;
    grid-column: 2;
  }
}
</style>
