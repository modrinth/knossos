<template>
  <div class="page-container">
    <div class="page-contents">
      <div class="content">
        <div class="header">
          <div class="icon">
            <img
              :src="
                mod.icon_url
                  ? mod.icon_url
                  : 'https://cdn.modrinth.com/placeholder.svg'
              "
              :alt="mod - icon"
            />
          </div>
          <div class="info">
            <h2 class="title">{{ mod.title }}</h2>
            <p class="description">
              {{ mod.description }}
            </p>
          </div>
        </div>
        <div class="mod-navigation">
          <div class="tabs">
            <nuxt-link :to="'/mod/' + mod.id" class="tab">
              <InfoIcon />
              Description
            </nuxt-link>
            <nuxt-link :to="'/mod/' + mod.id + '/versions'" class="tab">
              <VersionIcon />
              Versions
            </nuxt-link>
            <a v-if="mod.wiki_url" :href="mod.wiki_url" class="tab">
              <ExternalIcon />
              Wiki
            </a>
            <a
              v-if="mod.issues_url"
              :href="mod.issues_url"
              :target="_blank"
              class="tab"
            >
              <ExternalIcon />
              Issues
            </a>
            <a
              v-if="mod.source_url"
              :href="mod.source_url"
              :target="_blank"
              class="tab"
            >
              <ExternalIcon />
              Source
            </a>
            <nuxt-link
              v-if="
                this.$auth.loggedIn &&
                members.find((x) => x.user_id === this.$auth.user.id)
              "
              :to="'/mod/' + mod.id + '/settings'"
              class="tab"
            >
              <SettingsIcon />
              Settings
            </nuxt-link>
            <div class="filler" />
          </div>
        </div>
        <div class="mod-content">
          <slot />
        </div>
      </div>
      <section class="mod-info">
        <div class="mod-stats">
          <h3>Info</h3>
          <p>{{ mod.downloads }} Downloads</p>
          <p>Created {{ $dayjs(mod.published).fromNow() }}</p>
          <p>Updated {{ $dayjs(mod.updated).fromNow() }}</p>
        </div>
        <div>
          <h3>Members</h3>
          <div
            v-for="member in members"
            :key="member.user_id"
            class="team-member columns"
          >
            <img :src="member.avatar_url" alt="profile-picture" />
            <div class="member-info">
              <nuxt-link :to="'/user/' + member.user_id">
                <h4>{{ member.name }}</h4>
              </nuxt-link>
              <h3>{{ member.role }}</h3>
            </div>
          </div>
        </div>
        <div v-if="versions.length > 0">
          <h3>Featured Versions</h3>
          <div
            v-for="version in versions"
            :key="version.id"
            class="featured-version columns"
          >
            <div class="version-info">
              <div class="columns">
                <h4 class="limit-text-width">
                  {{ version.name }}
                </h4>
                <p
                  v-if="version.version_type === 'release'"
                  class="badge green"
                >
                  Release
                </p>
                <p v-if="version.version_type === 'beta'" class="badge yellow">
                  Beta
                </p>
                <p v-if="version.version_type === 'alpha'" class="badge red">
                  Alpha
                </p>
              </div>
              <div class="columns info-2">
                <p class="version-number limit-text-width">
                  {{ version.version_number }}
                </p>
                <FabricIcon
                  v-if="version.loaders.includes('fabric')"
                  stroke="#AC6C3A"
                />
                <ForgeIcon
                  v-if="version.loaders.includes('forge')"
                  stroke="#8B81E6"
                />
                <p
                  v-if="version.game_versions.length > 0"
                  class="game-version limit-text-width"
                >
                  {{ version.game_versions[0] }}
                </p>
              </div>
            </div>
            <nuxt-link :to="'/mod/' + mod.id + '/version/' + version.id">
              <DownloadIcon />
            </nuxt-link>
          </div>
          <client-only>
            <EthicalAd type="image" />
          </client-only>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import EthicalAd from '@/components/EthicalAd'

import DownloadIcon from '~/assets/images/utils/download.svg?inline'
import ExternalIcon from '~/assets/images/utils/external.svg?inline'
import InfoIcon from '~/assets/images/utils/info.svg?inline'
import VersionIcon from '~/assets/images/utils/version.svg?inline'
import SettingsIcon from '~/assets/images/utils/settings.svg?inline'

import ForgeIcon from '~/assets/images/categories/forge.svg?inline'
import FabricIcon from '~/assets/images/categories/fabric.svg?inline'

export default {
  name: 'ModPage',
  components: {
    EthicalAd,
    ExternalIcon,
    InfoIcon,
    VersionIcon,
    SettingsIcon,
    ForgeIcon,
    FabricIcon,
    DownloadIcon,
  },
  props: {
    mod: {
      type: Object,
      default() {
        return {}
      },
    },
    versions: {
      type: Array,
      default() {
        return []
      },
    },
    members: {
      type: Array,
      default() {
        return []
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
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
    .title {
      margin: 0;
      margin-top: var(--spacing-card-md);
      margin-right: var(--spacing-card-md);
      color: var(--color-text-dark);
      font-size: var(--font-size-lg);
    }
    .description {
      margin: 0;
      margin-top: var(--spacing-card-sm);
      margin-right: var(--spacing-card-md);
      height: 100%;
      color: var(--color-text-dark);
    }
  }
}

.mod-navigation {
  @extend %card-spaced-b;
  padding-bottom: 0.2rem;
}

.mod-info {
  min-width: 270px;
  max-width: 270px;
  padding: var(--spacing-card-lg);
  padding-top: 0;
  height: auto;
  @extend %card-spaced-b;
  margin-left: var(--spacing-card-lg);

  h3 {
    color: var(--color-text-heading);
    font-size: 0.8rem;
    letter-spacing: 0.02rem;
    margin-top: var(--spacing-card-lg);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }

  .mod-stats {
    margin-left: 5px;
    p {
      margin: 3px;
    }
  }

  .team-member {
    margin-left: 5px;
    margin-bottom: 10px;

    img {
      border-radius: var(--size-rounded-icon);
      height: 50px;
      width: 50px;
    }
    .member-info {
      max-width: 150px;
      overflow: hidden;
      margin: auto 0 auto 0.5rem;
      h4 {
        font-weight: normal;
        margin: 0;
      }
      h3 {
        margin-top: 0.1rem;
        margin-bottom: 0;
      }
    }
  }

  .featured-version {
    margin-left: 5px;
    margin-bottom: 10px;
    border: 1px solid var(--color-grey-1);
    border-radius: var(--size-rounded-sm);

    .version-info {
      padding: 5px 10px;
      h4 {
        max-width: 120px;
        font-weight: normal;
        margin: 0 10px 0 0;
      }
      .badge {
        margin: 0;
        display: inline-block;
      }
      .info-2 {
        overflow: hidden;
        max-width: 180px;
        align-items: center;

        .version-number {
          max-width: 80px;
        }

        .game-version {
          max-width: 120px;
        }

        p {
          color: var(--color-grey-4);
          font-weight: lighter;
          margin: 0 10px 0 0;
        }

        svg {
          min-width: 24px;
          min-height: 24px;
          margin-right: 10px;
        }
      }
    }

    a {
      display: table-cell;
      margin-left: auto;
      width: 40px;
      height: 60px;
      background-color: var(--color-grey-1);
      color: var(--color-grey-3);

      svg {
        margin-top: 15px;
        height: 30px;
        width: 40px;
      }

      &:hover,
      &:focus {
        background-color: var(--color-grey-3);
        color: var(--color-grey-4);
      }
    }
  }
}

.limit-text-width {
  display: inline-block;
  height: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media screen and (max-width: 550px) {
  .title a {
    display: none;
  }
}

@media screen and (max-width: 800px) {
  .mod-navigation {
    display: block;
    overflow-x: auto;
    overflow-wrap: break-word;
    overflow-y: hidden;
  }
}

@media screen and (max-width: 1400px) {
  .mod-info {
    display: none;
  }
}
</style>
