<template>
  <article class="project-card card" :aria-label="name" role="listitem">
    <div class="columns">
      <div class="icon">
        <nuxt-link :to="`/${$getProjectTypeForUrl(type, categories)}/${id}`">
          <Avatar :src="iconUrl" :alt="name" size="md" />
        </nuxt-link>
      </div>
      <div class="card-content">
        <div class="info">
          <div class="top">
            <h2 class="title">
              <nuxt-link
                :to="`/${$getProjectTypeForUrl(type, categories)}/${id}`"
              >
                {{ name }}
              </nuxt-link>
            </h2>
            <p v-if="author" class="author">
              <IntlFormatted
                message-id="component.project-card.author"
                :values="{ author }"
              >
                <template #link="{ children }">
                  <nuxt-link class="title-link" :to="'/user/' + author">
                    <Fragment :of="children" />
                  </nuxt-link>
                </template>
              </IntlFormatted>
            </p>
          </div>
          <div
            v-if="sideTip != null && search && !moderation"
            class="side-type"
          >
            <div class="side-descriptor">
              <InfoIcon aria-hidden="true" />
              {{ sideTip }}
            </div>
          </div>
          <div v-else-if="moderation" class="side-descriptor">
            <InfoIcon aria-hidden="true" />
            {{ $t(`project-type.${coercedProjectType}.singular`) }}
          </div>
          <p class="description">
            {{ description }}
          </p>
          <Categories
            :categories="categories"
            :type="type"
            class="right-categories"
          />
          <div class="dates">
            <div
              v-tooltip="
                $fmt.date(createdAt, {
                  dateStyle: 'long',
                  timeStyle: 'medium',
                })
              "
              class="date"
            >
              <CalendarIcon aria-hidden="true" />
              {{
                $t('project.stats.created', {
                  ago: $fmt.timeDifference(createdAt),
                })
              }}
            </div>
            <div
              v-tooltip="
                $fmt.date(updatedAt, {
                  dateStyle: 'long',
                  timeStyle: 'medium',
                })
              "
              class="date"
            >
              <EditIcon aria-hidden="true" />
              {{
                $t('project.stats.updated', {
                  ago: $fmt.timeDifference(updatedAt),
                })
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-side">
      <div v-if="downloads" class="stat">
        <DownloadIcon aria-hidden="true" />
        <p>
          <IntlFormatted
            message-id="project.stats.downloads"
            :values="
              $deunionize(
                $fmt.compactNumber(downloads),
                '$counter',
                'downloads'
              )
            "
          >
            <template #~counter="{ values: { $counter } }">
              <strong>{{ $counter }}</strong>
            </template>
          </IntlFormatted>
        </p>
      </div>
      <div v-if="follows" class="stat">
        <HeartIcon aria-hidden="true" />
        <p>
          <IntlFormatted
            message-id="project.stats.followers"
            :values="
              $deunionize($fmt.compactNumber(follows), '$counter', 'followers')
            "
          >
            <template #~counter="{ values: { $counter } }">
              <strong>{{ $counter }}</strong>
            </template>
          </IntlFormatted>
        </p>
      </div>
      <div class="mobile-dates">
        <div class="date">
          <CalendarIcon aria-hidden="true" />
          {{
            $t('component.project-card.created', {
              ago: $fmt.timeDifference(createdAt),
            })
          }}
        </div>
        <div class="date">
          <EditIcon aria-hidden="true" />
          {{
            $t('component.project-card.updated', {
              ago: $fmt.timeDifference(updatedAt),
            })
          }}
        </div>
      </div>
      <div v-if="status" class="status">
        <Badge
          v-if="status === 'approved'"
          color="green custom-circle"
          :type="$t(`project-status.${status}`)"
        />
        <Badge
          v-else-if="status === 'processing' || status === 'archived'"
          color="yellow custom-circle"
          :type="$t(`project-status.${status}`)"
        />
        <Badge
          v-else-if="status === 'rejected'"
          color="red custom-circle"
          :type="$t(`project-status.${status}`)"
        />
        <Badge
          v-else
          color="gray custom-circle"
          :type="$t(`project-status.${status}`)"
        />
      </div>
      <div class="buttons">
        <slot />
      </div>
    </div>
  </article>
</template>

<script>
import Categories from '~/components/ui/search/Categories'
import Badge from '~/components/ui/Badge'

import InfoIcon from '~/assets/images/utils/info.svg?inline'
import CalendarIcon from '~/assets/images/utils/calendar.svg?inline'
import EditIcon from '~/assets/images/utils/updated.svg?inline'
import DownloadIcon from '~/assets/images/utils/download.svg?inline'
import HeartIcon from '~/assets/images/utils/heart.svg?inline'
import Avatar from '~/components/ui/Avatar'

export default {
  name: 'ProjectCard',
  components: {
    Avatar,
    Categories,
    Badge,
    InfoIcon,
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
  },
  computed: {
    loaders() {
      const loaders = []

      for (const { name: loader } of this.$tag.loaders) {
        if (this.categories.includes(loader) && !loaders.includes(loader)) {
          loaders.push(loader)
        }
      }

      return loaders
    },
    coercedProjectType() {
      return /** @type {import('vue/types/vue').Vue} */ (
        this
      ).$coerceProjectType(this.type, this.loaders)
    },
    projectSide() {
      return /** @type {import('vue/types/vue').Vue} */ (
        this
      ).$computeProjectSide(this.clientSide, this.serverSide)
    },
    sideTip() {
      return /** @type {import('vue/types/vue').Vue} */ (
        this
      ).$computeProjectTypeDisplay(this.projectSide, this.coercedProjectType)
    },
  },
}
</script>

<style lang="scss" scoped>
.columns {
  width: 100%;
}

.project-card {
  display: flex;
  flex-direction: row;
  padding: var(--spacing-card-bg);
  width: calc(100% - 2 * var(--spacing-card-bg));

  @media screen and (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
  }

  .icon {
    margin: 0 var(--spacing-card-md) var(--spacing-card-md) 0;
  }

  .card-content {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;

    .info {
      display: flex;
      flex-direction: column;

      .top {
        align-items: baseline;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        flex-shrink: 0;
        margin-right: var(--spacing-card-md);

        .title {
          margin: 0 0.5rem 0 0;
          overflow-wrap: anywhere;
          color: var(--color-text-dark);
          font-size: var(--font-size-xl);
        }

        .author {
          margin: auto 0 0 0;
          color: var(--color-text);
        }
      }

      .side-descriptor {
        display: flex;
        align-items: center;
        font-weight: bolder;
        font-size: var(--font-size-sm);

        margin: 0.125rem 0;

        svg {
          width: auto;
          height: 1rem;
          margin-right: 0.125rem;
        }
      }

      .description {
        margin: var(--spacing-card-sm) var(--spacing-card-md)
          var(--spacing-card-sm) 0;
      }

      .right-categories {
        margin-bottom: var(--spacing-card-sm);
      }

      .dates {
        display: flex;
        flex-wrap: wrap;

        .date {
          display: flex;
          align-items: center;
          margin-right: 2rem;
          cursor: default;

          svg {
            width: 1.25rem;
            height: 1.25rem;
            margin-right: 0.25rem;
          }
        }
      }
    }
  }

  .right-side {
    min-width: fit-content;

    .stat {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;

      svg {
        width: auto;
        height: 1.25rem;

        margin-left: auto;
        margin-right: 0.25rem;
      }

      p {
        margin: 0;

        strong {
          font-weight: bolder;
          font-size: var(--font-size-lg);
        }
      }
    }

    .status {
      margin-bottom: 0.5rem;
    }

    .buttons {
      display: flex;
      flex-direction: column;

      button,
      a {
        margin-right: 0;
        margin-left: auto;
        margin-bottom: 0.5rem;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .mobile-dates {
      display: none;
    }
  }

  @media screen and (max-width: 800px) {
    flex-wrap: wrap;

    .card-content {
      flex-direction: column;

      .info {
        .dates {
          display: none;
        }
      }
    }

    .right-side {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      align-items: center;

      text-align: left;

      .stat {
        margin-bottom: 0;
      }

      .stat svg {
        margin-left: 0;
      }

      .buttons {
        flex: 1 1 100%;
      }

      .buttons button,
      a {
        margin-left: unset;
        margin-right: unset;
      }

      .status {
        margin-bottom: 0;
      }

      .mobile-dates {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 0.5rem;
        color: var(--color-icon);
        font-size: var(--font-size-nm);

        .date {
          display: flex;
          align-items: center;
          cursor: default;

          svg {
            width: 1rem;
            height: 1rem;
            margin-right: 0.25rem;
          }
        }
      }
    }
  }
}
</style>
