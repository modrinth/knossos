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
              Description
            </nuxt-link>
            <nuxt-link :to="'/mod/' + mod.id + '/versions'" class="tab">
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
        <div class="section">
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
        <div v-if="versions.length > 0" class="section">
          <h3>Featured Versions</h3>
          <div
            v-for="version in versions"
            :key="version.id"
            class="featured-version"
          >
            <nuxt-link
              :to="'/mod/' + mod.id + '/version/' + version.id"
              class="download"
            >
              <DownloadIcon />
            </nuxt-link>
            <div class="info">
              <div class="top">
                <span
                  v-if="version.version_type === 'release'"
                  class="badge green"
                >
                  Release
                </span>
                <span
                  v-if="version.version_type === 'beta'"
                  class="badge yellow"
                >
                  Beta
                </span>
                <span v-if="version.version_type === 'alpha'" class="badge red">
                  Alpha
                </span>
                <h4 class="title">
                  {{ version.name }}
                </h4>
              </div>
              <div class="bottom">
                <span class="version-number limit-text-width">
                  {{ version.version_number }}
                </span>
                <FabricIcon
                  v-if="version.loaders.includes('fabric')"
                  class="loader"
                />
                <ForgeIcon
                  v-if="version.loaders.includes('fabric')"
                  class="loader"
                />
                <span
                  v-if="version.game_versions.length > 0"
                  class="game-version limit-text-width"
                >
                  {{ version.game_versions[0] }}
                </span>
              </div>
            </div>
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

import ForgeIcon from '~/assets/images/categories/forge.svg?inline'
import FabricIcon from '~/assets/images/categories/fabric.svg?inline'

export default {
  name: 'ModPage',
  components: {
    EthicalAd,
    ExternalIcon,
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
  height: auto;
  @extend %card-spaced-b;
  margin-left: var(--spacing-card-lg);

  .section {
    margin-top: var(--spacing-card-lg);
  }

  h3 {
    @extend %large-label;
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
    @extend %row;
    padding-top: var(--spacing-card-sm);
    padding-bottom: var(--spacing-card-sm);
    .download {
      display: flex;
      align-items: center;
      height: 2rem;
      width: 2rem;
      border-radius: 2rem;
      background-color: var(--color-button-bg);
      margin-right: var(--spacing-card-sm);
      svg {
        width: 1.25rem;
        margin: auto;
      }
    }
    .info {
      @extend %column;
      font-size: var(--font-size-sm);
      .top {
        @extend %row;
        .badge {
          font-size: var(--font-size-xs);
          margin-right: var(--spacing-card-sm);
        }
        .title {
          margin: 0;
        }
      }
      .bottom {
        @extend %row;
        .loader {
          height: 1rem;
        }
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
