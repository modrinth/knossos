<template>
  <div class="page">
    <div class="cover">
      <img
        class="cover-image"
        src="~/assets/images/landing.svg"
        width="100%"
        alt="cover-image"
      />
      <div class="text">
        <h1>{{ $t('landing.title') }}</h1>
        <h3>
          <i18n-formatted message-id="landing.headline">
            <a
              v-i18n:wrap="'repo-link'"
              href="https://github.com/modrinth"
              target="_blank"
            />
            <a
              v-i18n:wrap="'docs-link'"
              href="https://docs.modrinth.com"
              target="_blank"
            />
            <sup v-i18n:wrap="'sup'" />
          </i18n-formatted>
        </h3>
        <form action="/mods">
          <div class="iconified-input">
            <label class="hidden" for="q">{{
              $t('landing.search-field.label')
            }}</label>
            <SearchIcon />
            <input
              id="q"
              type="search"
              name="q"
              :placeholder="$t('landing.search-field.placeholder')"
              autocomplete="off"
            />
          </div>
          <button class="iconified-button brand-button" type="submit">
            <RightArrowIcon />
            {{ $t('landing.search-button.text') }}
          </button>
        </form>
      </div>
    </div>
    <div class="points card">
      <div class="point">
        <div class="image">
          <video
            v-if="$colorMode.value === 'light'"
            autoplay
            loop
            muted
            src="https://cdn.modrinth.com/homepage/search.mp4"
            playsinline
          />
          <video
            v-else
            autoplay
            loop
            muted
            src="https://cdn.modrinth.com/homepage/search-dark.mp4"
            playsinline
          />
        </div>
        <div class="text-container">
          <h3 class="subheader">{{ $t('landing.feature.search.title') }}</h3>
          <h1>{{ $t('landing.feature.search.headline') }}</h1>
          <p>
            {{ $t('landing.feature.search.body') }}
          </p>
        </div>
      </div>
      <div class="point left">
        <div class="text-container">
          <div>
            <h3 class="subheader">
              {{ $t('landing.feature.active-development.title') }}
            </h3>
            <h1>{{ $t('landing.feature.active-development.headline') }}</h1>
            <p>
              <i18n-formatted
                message-id="landing.feature.active-development.body"
              >
                <a
                  v-i18n:wrap="'discord-link'"
                  href="https://discord.gg/EUHuJHt"
                  target="_blank"
                />
              </i18n-formatted>
            </p>
            <div class="features">
              <div class="feature completed">
                <CheckIcon />
                <p>
                  <a href="https://github.com/modrinth" target="_blank">{{
                    $t('landing.feature.feature-set.open-source')
                  }}</a>
                </p>
              </div>
              <div class="feature completed">
                <CheckIcon />
                <p>{{ $t('landing.feature.feature-set.search') }}</p>
              </div>
              <div class="feature completed">
                <CheckIcon />
                <p>
                  {{ $t('landing.feature.feature-set.project-customization') }}
                </p>
              </div>
              <div class="feature completed">
                <CheckIcon />
                <p>{{ $t('landing.feature.feature-set.teams') }}</p>
              </div>
              <div class="feature completed">
                <CheckIcon />
                <p>
                  <a href="https://docs.modrinth.com" target="_blank">
                    {{ $t('landing.feature.feature-set.api') }}
                  </a>
                </p>
              </div>
              <div class="feature completed">
                <CheckIcon />
                <p>{{ $t('landing.feature.feature-set.dependencies') }}</p>
              </div>
              <div class="feature in-progress">
                <CheckIcon />
                <p>{{ $t('landing.feature.feature-set.modpacks') }}</p>
              </div>
              <div class="feature in-progress">
                <InProgressIcon />
                <p>{{ $t('landing.feature.feature-set.payouts') }}</p>
              </div>
              <div class="feature in-progress">
                <InProgressIcon />
                <p>
                  {{ $t('landing.feature.feature-set.more-project-types') }}
                </p>
              </div>
              <div class="feature in-progress">
                <InProgressIcon />
                <p>{{ $t('landing.feature.feature-set.analytics') }}</p>
              </div>
              <div class="feature in-progress">
                <InProgressIcon />
                <p>{{ $t('landing.feature.feature-set.auth-system') }}</p>
              </div>
              <div class="feature in-progress">
                <InProgressIcon />
                <p>{{ $t('landing.feature.feature-set.feedback') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="image">
          <FeaturesIllustration />
        </div>
      </div>
      <div class="point">
        <div class="image">
          <div class="terminal">
            <div class="line-nums">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10</span>
              <span>11</span>
              <span>12</span>
              <span>13</span>
              <span>14</span>
              <span>15</span>
            </div>
            <div v-highlightjs class="text">
              <span class="command">curl</span>
              <span>https://api.modrinth.com/v2/project/sodium</span>
              <pre><code class="language-json">
{
  "id": "AANobbMI",
  "slug": "sodium",
  "project_type": "mod",
  "team": "4reLOAKe",
  "title": "Sodium",
  "description": "Modern rendering engine and client-side optimization mod for Minecraft",
  "body": "...",
  "body_url": "https://cdn.modrinth.com/data/AANobbMI/description.md",
  "published": "2021-01-03T00:53:34.185936Z",
  "updated": "2022-01-14T02:35:40.373686Z",
  ...
}</code></pre>
            </div>
          </div>
        </div>
        <div class="text-container">
          <h3 class="subheader">{{ $t('landing.feature.api.title') }}</h3>
          <h1>{{ $t('landing.feature.api.headline') }}</h1>
          <p>
            <i18n-formatted message-id="landing.feature.api.body">
              <a
                v-i18n:wrap="'docs-link'"
                href="https://docs.modrinth.com"
                target="_blank"
              />
            </i18n-formatted>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchIcon from '~/assets/images/utils/search.svg?inline'
import CheckIcon from '~/assets/images/utils/check.svg?inline'
import InProgressIcon from '~/assets/images/utils/updated.svg?inline'
import RightArrowIcon from '~/assets/images/utils/right-arrow.svg?inline'

import FeaturesIllustration from '~/assets/images/illustrations/features.svg?inline'

export default {
  components: {
    SearchIcon,
    RightArrowIcon,
    CheckIcon,
    InProgressIcon,
    FeaturesIllustration,
  },
  auth: false,
  data() {
    return {}
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.page {
  max-width: 1280px;
  margin: 0 auto;

  .cover {
    img {
      border-radius: var(--size-rounded-card);
      width: 100%;
      height: 40rem;
      object-fit: cover;
      object-position: 15% 12.5%;

      @media screen and (max-width: 1280px) {
        border-radius: 0;
      }
    }

    .text {
      position: absolute;
      top: calc(5rem + var(--size-navbar-height));
      max-width: 30rem;
      text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);
      padding-left: 6rem;

      color: #fff;

      h1 {
        color: #fff;
        margin: 1rem 0;
        font-size: var(--font-size-2xl);
      }

      h3 {
        color: #fff;
        font-size: var(--font-size-lg);
        font-weight: normal;
        margin-bottom: 1rem;

        a {
          text-decoration: underline;
        }
      }

      form {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.25rem;
        box-sizing: border-box;

        input {
          box-sizing: content-box;
        }
      }

      @media screen and (max-width: 750px) {
        padding: 1rem;
      }
    }
  }

  .points {
    border-radius: 0;
    padding: var(--spacing-card-lg);
    margin-top: 1rem;

    .point {
      display: flex;
      align-items: center;
      flex-direction: column-reverse;
      margin-bottom: 1rem;

      &.left {
        flex-direction: column;
      }

      .text-container {
        .subheader {
          margin: 0;
          color: var(--color-brand);
        }

        a {
          text-decoration: underline;
        }

        .features {
          display: flex;
          flex-wrap: wrap;
          row-gap: 1rem;

          .feature {
            width: 100%;
            display: flex;
            align-items: flex-start;

            p {
              margin: 0;
              line-height: 1.5rem;
            }

            svg {
              min-width: 1.5rem;
              height: 1.5rem;
              margin-right: 0.5rem;
            }

            &.completed {
              svg {
                color: var(--color-brand);
              }
            }

            &.in-progress {
              svg {
                color: var(--color-badge-yellow-text);
              }
            }
          }
        }
      }

      .image {
        display: none;
        padding: 2rem;

        svg {
          color: var(--color-brand);
          width: 36rem;
          height: unset;
        }

        img,
        video {
          border-radius: var(--size-rounded-lg);
          width: 40rem;
        }

        .terminal {
          display: flex;
          padding: 0.5rem 1rem;
          border-radius: var(--size-rounded-lg);
          background-color: var(--color-code-bg);
          font-family: monospace;
          font-size: 80%;
          line-height: 1.5rem;

          .line-nums {
            display: flex;
            flex-direction: column;
            padding: 0.5rem;
            color: var(--color-icon);
          }

          .text {
            padding: 0.5rem;
            .command {
              color: var(--color-brand);
            }

            pre {
              margin: 0;
              padding: 0;
              border-radius: 0;
              overflow-y: hidden;
              background-color: var(--color-code-bg);

              code {
                padding: 0;

                border-radius: 0;
                background-color: var(--color-code-bg);
                color: var(--color-code-text);
              }
            }
          }
        }
      }
    }
  }

  @media screen and (min-width: 500px) {
    .points {
      .point {
        .text-container {
          .features {
            .feature {
              width: 50%;
            }
          }
        }
      }
    }
  }

  @media screen and (min-width: 750px) {
    .points {
      .point {
        margin-bottom: 0;

        .image {
          display: block;
        }
      }
    }
  }

  @media screen and (min-width: 1200px) {
    .points {
      border-radius: var(--size-rounded-card);
      .point {
        flex-direction: row;

        &.left {
          flex-direction: row;

          .text-container {
            padding-left: 3rem;
            padding-right: 0;
          }
        }

        .text-container {
          width: 60%;
          padding-right: 3rem;

          .features {
            .feature {
              width: 33%;
            }
          }
        }
      }
    }
  }
}
</style>
