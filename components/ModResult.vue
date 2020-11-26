<template>
  <div class="project-card">
    <div class="icon">
      <img
        :src="iconUrl ? iconUrl : 'https://cdn.modrinth.com/placeholder.svg'"
        :alt="name"
      />
    </div>
    <div class="info">
      <div class="top">
        <h2 class="title">
          <a :href="pageUrl">{{ name }}</a>
        </h2>
        <p v-if="author" class="author">
          by <a :href="authorUrl">{{ author }}</a>
        </p>
      </div>
      <p class="description">
        {{ description }}
      </p>
      <div class="bottom">
        <div class="stats">
          <div class="stat">
            <DownloadIcon />
            <div class="info">
              <h4>Downloads</h4>
              <p class="value">{{ formatNumber(downloads) }}</p>
            </div>
          </div>
          <div class="stat">
            <CalendarIcon />
            <div class="info">
              <h4>Created</h4>
              <p
                v-tooltip="
                  $dayjs(createdAt).format(
                    '[Created on] YYYY-MM-DD [at] HH:mm A'
                  )
                "
                class="value"
              >
                {{ $dayjs(createdAt).fromNow() }}
              </p>
            </div>
          </div>
          <div class="stat">
            <EditIcon />
            <div class="info">
              <h4>Updated</h4>
              <p
                v-tooltip="
                  $dayjs(updatedAt).format(
                    '[Updated on] YYYY-MM-DD [at] HH:mm A'
                  )
                "
                class="value"
              >
                {{ $dayjs(updatedAt).fromNow() }}
              </p>
            </div>
          </div>
          <div class="stat">
            <TagIcon />
            <div class="info">
              <h4>Available For</h4>
              <p class="value">
                {{ latestVersion }}
              </p>
            </div>
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
.project-card {
  @extend %row;
  @extend %card-spaced-b;
  width: 100%;
  .icon {
    margin: auto 0;
    img {
      width: 6rem;
      height: 6rem;
      margin: var(--spacing-card-md);
      border-radius: var(--size-rounded-icon);
      object-fit: contain;
    }
  }
  .info {
    @extend %column;
    .top {
      @extend %row;
      flex-wrap: wrap;
      margin-top: var(--spacing-card-md);
      margin-right: var(--spacing-card-md);
      .title {
        margin: 0;
        color: var(--color-text-dark);
        font-size: var(--font-size-lg);
      }
      .author {
        margin: 0;
        margin-left: 0.5rem;
        margin-top: auto;
        color: var(--color-text);
      }
    }
    .description {
      margin: 0;
      margin-top: calc(var(--spacing-card-sm) / 2);
      margin-right: var(--spacing-card-md);
      height: 100%;
      color: var(--color-text-dark);
    }
    .bottom {
      @extend %column;
      margin-top: var(--spacing-card-sm);
      margin-right: var(--spacing-card-md);
      margin-bottom: var(--spacing-card-md);

      @media screen and (min-width: 1024px) {
        flex-direction: row;
      }

      .stats {
        @extend %row;
        flex-wrap: wrap;

        @media screen and (min-width: 900px) {
          flex-wrap: nowrap;
        }
        .stat {
          margin-top: 0.5rem;
          margin-right: 1rem;
          @extend %row;

          @media screen and (min-width: 900px) {
            margin-top: 0;
          }
          svg {
            margin: auto 0;
            margin-right: 0.5rem;
            height: 1.5rem;
            width: 1.5rem;
            color: var(--color-icon);
          }
          .info {
            margin: auto 0;
            white-space: nowrap;
            h4 {
              // min-width: fit-content;
              color: var(--color-text);
              font-size: var(--font-size-xxs);
              font-weight: var(--font-weight-extrabold);
              letter-spacing: 0.02rem;
              margin: 0;
              margin-bottom: 0.25em;
              text-transform: uppercase;
            }
            .value {
              font-size: var(--font-size-sm);
              margin: 0;
              color: var(--color-text-dark);
            }
          }
        }
      }
      .categories {
        @extend %row;
        flex-wrap: wrap;
        margin-top: var(--spacing-card-sm);

        @media screen and (min-width: 1024px) {
          flex-direction: row;
          margin: auto 0;
        }
        p {
          display: flex;
          align-items: center;
          flex-direction: row;
          background-color: var(--color-category-bg);
          border-radius: var(--size-rounded-max);
          color: var(--color-category-text);
          margin-top: 0.25em;
          margin-bottom: 0.25em;
          margin-right: 0.5em;
          padding: 0.4em 0.7em;
          font-size: var(--font-size-sm);
          height: 1em;
          svg {
            width: 15px;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>
