<script setup>
import Avatar from "~/components/ui/Avatar.vue";
import homepageProjects from "~/generated/homepage.json";
import LogoAnimated from "~/components/brand/LogoAnimated.vue";
import Badge from "~/components/ui/Badge.vue";
import { default as PrismIcon } from "~/assets/images/external/prism.svg";
import { default as ATLauncher } from "~/assets/images/external/atlauncher.svg";
import Checkbox from "~/components/ui/Checkbox.vue";
import {TrashIcon, SearchIcon, BoxIcon, SendIcon, EditIcon} from "omorphia";


const val = Math.ceil(homepageProjects.length / 4)

const rows = shallowRef([
  homepageProjects.slice(0, val),
  homepageProjects.slice(val, val * 2),
  homepageProjects.slice(val * 2, val * 3),
  homepageProjects.slice(val * 3, val * 4),
  homepageProjects.slice(val * 3, val * 4),
])
</script>

<template>
  <div class="landing-hero">
    <h1 class="main-header">
      Download Modrinth <br/>
      app for {{'Mac'}}
    </h1>
    <h2 class="main-subheader">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    </h2>
    <div class="button-group">
      <nuxt-link to="/mods" class="iconified-button brand-button btn btn-large"> More Download Options </nuxt-link>
      <nuxt-link
        to="sign-up"
        class="iconified-button outline-button btn btn-large"
        rel="noopener nofollow"
      >
        Download Modrinth App
      </nuxt-link>
    </div>
    <img src="https://i.imgur.com/n6pheS4.png" alt="cube maze"/>
    <div class="bottom-transition" />
  </div>
  <div class="features">
    <div class="feature-grid">
      <div class="top-transition" />
      <div class="feature gradient-border mods">
        <div class="search-bar">
          <h4>
            Installed mods
          </h4>
          <div class="mini-input">
            <SearchIcon/>
            <div class="search">
              Search mods
            </div>
          </div>
        </div>
        <div class="header row">
          <div/>
          <div class="cell">Name</div>
          <div class="cell">Version</div>
          <div class="cell">Actions</div>
        </div>
        <div class="table">
          <div class="row">
            <div class="cell">
              <Avatar size="sm" src="https://cdn.modrinth.com/data/P7dR8mSH/icon.png"/>
            </div>
            <div class="cell">
              <div class="name">Fabric API</div>
              <div class="description">by modmuss</div>
            </div>
            <div class="cell important">1.0.0</div>
            <div class="cell check">
              <Checkbox :model-value="true"/>
              <button class="btn icon-only transparent">
                <TrashIcon/>
              </button>
            </div>
          </div>
          <div class="row">
            <div class="cell">
              <Avatar size="sm" src="https://cdn.modrinth.com/data/AANobbMI/icon.png"/>
            </div>
            <div class="cell">
              <div class="name">Sodium</div>
              <div class="description">by jellysquid3</div>
            </div>
            <div class="cell">% CPU</div>
            <div class="cell check">
              <Checkbox :model-value="true"/>
              <button class="btn icon-only transparent">
                <TrashIcon/>
              </button>
            </div>
          </div>
          <div class="row">
            <div class="cell">
              <Avatar size="sm" src="https://cdn.modrinth.com/data/YL57xq9U/dc558eece920db435f9823ce86de0c4cde89800b.png"/>
            </div>
            <div class="cell">
              <div class="name">Iris Shaders</div>
              <div class="description">by coderbot</div>
            </div>
            <div class="cell">% CPU</div>
            <div class="cell check">
              <Checkbox :model-value="true"/>
              <button class="btn icon-only transparent">
                <TrashIcon/>
              </button>
            </div>
          </div>
          <div class="row">
            <div class="cell">
              <Avatar size="sm" src="https://cdn.modrinth.com/data/gvQqBUqZ/icon.png"/>
            </div>
            <div class="cell">
              <div class="name">Lithium</div>
              <div class="description">by jellysquid3</div>
            </div>
            <div class="cell">% CPU</div>
            <div class="cell check">
              <Checkbox :model-value="true"/>
              <button class="btn icon-only transparent">
                <TrashIcon/>
              </button>
            </div>
          </div>
          <div class="row">
            <div class="cell">
              <Avatar size="sm" src="https://cdn.modrinth.com/data/mOgUt4GM/icon.png"/>
            </div>
            <div class="cell">
              <div class="name">Mod Menu</div>
              <div class="description">by Prospector</div>
            </div>
            <div class="cell">% CPU</div>
            <div class="cell check">
              <Checkbox :model-value="true"/>
              <button class="btn icon-only transparent">
                <TrashIcon/>
              </button>
            </div>
          </div>
          <div class="row">
            <div class="cell">
              <Avatar size="sm" src="https://cdn.modrinth.com/data/9s6osm5g/icon.png"/>
            </div>
            <div class="cell">
              <div class="name">Cloth Config API</div>
              <div class="description">by shedaniel</div>
            </div>
            <div class="cell">% CPU</div>
            <div class="cell check">
              <Checkbox :model-value="true"/>
              <button class="btn icon-only transparent">
                <TrashIcon/>
              </button>
            </div>
          </div>
          <div class="row">
            <div class="cell">
              <Avatar size="sm" src="https://cdn.modrinth.com/data/lhGA9TYQ/icon.png"/>
            </div>
            <div class="cell">
              <div class="name">Architectury API</div>
              <div class="description">by shedaniel</div>
            </div>
            <div class="cell">% CPU</div>
            <div class="cell check">
              <Checkbox :model-value="true"/>
              <button class="btn icon-only transparent">
                <TrashIcon/>
              </button>
            </div>
          </div>
          <div class="row">
            <div class="cell">
              <Avatar size="sm" src="https://cdn.modrinth.com/data/nrJ2NpD0/0efcf28eb5c18bed0cc47d786879e32550861ca4.png"/>
            </div>
            <div class="cell">
              <div class="name">Craftify</div>
              <div class="description">by ThatGravyBoat</div>
            </div>
            <div class="cell">% CPU</div>
            <div class="cell check">
              <Checkbox :model-value="true"/>
              <button class="btn icon-only transparent">
                <TrashIcon/>
              </button>
            </div>
          </div>
        </div>
        <h3>Discovery</h3>
        <p>
          Get your project discovered by thousands of users through search, our home page, Discord
          server, and more ways to come in the future!
        </p>
      </div>
      <div class="feature gradient-border multiplayer">
        <h3>Discovery</h3>
        <p>
          Get your project discovered by thousands of users through search, our home page, Discord
          server, and more ways to come in the future!
        </p>
        <div class="table">
          <div class="header">
            <div class="cell">Feature</div>
            <div class="cell">Modrinth</div>
            <div class="cell">CurseForge</div>
          </div>
        </div>
      </div>
      <div class="feature gradient-border sharing">
        <div class="row header">
          Included mods <EditIcon/>
        </div>
        <div class="table">
          <div class="row">
            <div class="cell">
              <Avatar size="sm" src="https://cdn.modrinth.com/data/3ufwT9JF/2a15f23b7ffa2d50fc6ae1c42029a728ce3e2847.jpeg" />
            </div>
            <div class="cell">Ad Astra</div>
            <div class="cell">
              <div class="description">
                Live long and prosper, Ad Astra!
              </div>
            </div>
          </div>
          <div class="row">
            <div class="cell">
              <Avatar size="sm" src="https://cdn.modrinth.com/data/b1LdOZlE/465598dc5d89f67fb8f8de6def21240fa35e3a54.png" />
            </div>
            <div class="cell">Spirit</div>
            <div class="cell">
              <div class="description">
                A mod exploring soul magic in tools, blocks, weapons and more.
              </div>
            </div>
          </div>
          <div class="row">
            <div class="cell">
              <Avatar size="sm" src="https://cdn.modrinth.com/data/MI1LWe93/d42fb7a69f1e7a86584fa1ed43520af98acec065.png" />
            </div>
            <div class="cell">Creeper Overhaul</div>
            <div class="cell">A mod which overhauls the vanilla creepers!</div>
          </div>
        </div>
        <h3>Discovery</h3>
        <p>
          Get your project discovered by thousands of users through search, our home page, Discord
          server, and more ways to come in the future!
        </p>
        <div class="export-card">
          <Avatar size="md" src="https://cdn.modrinth.com/data/mY0lOQFc/81c6eff2b86220e12e62a4ad0d2f364a605c42c4.png" />
          <div class="info">
            <div class="exporting">
              <div class="tag"><BoxIcon/> Modpack</div>
              <div class="small-button">
                Share
                <SendIcon/>
              </div>
            </div>
            <h4 class="name">All of Fabric | Orion</h4>
            <div class="author">by AK</div>
          </div>
        </div>
      </div>
      <div class="feature gradient-border performance">
        <div class="title">
          <h3>Activity monitor</h3>
          <Badge color="green" type="Good performance"/>
        </div>
        <div class="header row">
          <div/>
          <div class="cell">Process name</div>
          <div class="cell">% CPU</div>
          <div class="cell">% GPU</div>
        </div>
        <div class="table">
          <div class="row">
            <div class="cell">
              <div>
                <div class="icon-logo modrinth">
                  <LogoAnimated class="icon"/>
                </div>
              </div>
            </div>
            <div class="cell important">Modrinth app</div>
            <div class="cell important">GREAT</div>
            <div class="cell important">GREAT</div>
          </div>
          <div class="row">
            <div class="cell">
              <div>
                <div class="icon-logo">
                </div>
              </div>
            </div>
            <div class="cell">Process name</div>
            <div class="cell">% CPU</div>
            <div class="cell">% GPU</div>
          </div>
          <div class="row">
            <div class="cell">
              <div>
                <div class="icon-logo">
                </div>
              </div>
            </div>
            <div class="cell">Process name</div>
            <div class="cell">% CPU</div>
            <div class="cell">% GPU</div>
          </div>
        </div>
        <h3>Performant</h3>
        <p>
          Modrinth app performs better than many of the leading mod managers!
        </p>
      </div>
      <div class="feature gradient-border website">
        <div class="icon-logo">
          <LogoAnimated class="icon"/>
        </div>
        <div class="ellipsis"/>
        <div class="projects-showcase">
          <div v-for="(row, index) in rows" :key="index" class="row">
            <div v-for="n in 2" :key="n" class="row__content" :class="{ offset: index % 2 }">
              <nuxt-link
                v-for="project in row"
                :key="project.id"
                class="project button-animation gradient-border"
                :to="`/${project.project_type}/${project.slug ? project.slug : project.id}`"
              >
                <Avatar :src="project.icon_url" :alt="project.title" size="sm" loading="lazy" />
                <div class="project-info">
                  <span class="title">
                    {{ project.title }}
                  </span>
                  <span class="description">
                    {{ project.description }}
                  </span>
                </div>
              </nuxt-link>
            </div>
          </div>
        </div>
        <h3>Discovery</h3>
        <p>
          Get your project discovered by thousands of users through search, our home page, Discord
          server, and more ways to come in the future!
        </p>
      </div>
      <div class="feature gradient-border importing">
        <div class="text">
          <h3>Discovery</h3>
          <p>
            Get your project discovered by thousands of users through search, our home page, Discord
            server, and more ways to come in the future!
          </p>
        </div>
          <div class="ring inner-ring">
            <div class="icon-logo">
              <LogoAnimated class="icon"/>
            </div>
            <div class="launcher-badge top-left">
              <img src="~/assets/images/external/gdlauncher.png" alt="GDLauncher"/>
            </div>
            <div class="launcher-badge top-right">
              <img src="~/assets/images/external/multimc.webp" alt="MultiMC"/>
            </div>
            <div class="launcher-badge bottom-left">
              <PrismIcon/>
            </div>
            <div class="launcher-badge bottom-right">
              <ATLauncher/>
            </div>
            <div class="first-ring"/>
            <div class="second-ring"/>
            <div class="third-ring"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.landing-hero {
  position: relative;
  opacity: 0.9800000190734863;
  background: #0f1121 url('https://i.imgur.com/fUDA2cO.png') no-repeat top;
  background-size: cover;
  padding: 6rem 1rem 12rem 1rem;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;

  .main-header {
    font-size: 5.5rem;
    mask-image: none;
  }

  .main-subheader {
    font-size: 1.625rem;
  }

  h2 {
    line-height: 125%;
    margin: 0 0 1.625rem;
    font-weight: 400;
    line-break: loose;
    color: var(--landing-color-subheading);
    max-width: 1096px;
    mask-image: none;
  }

  .button-group {
    width: fit-content;
    gap: 1.25rem;
    margin: 0 auto 5rem;
    justify-content: center;
    mask-image: none;

    .outline-button {
      color: var(--landing-color-heading);
      background: none;
      border: 1px var(--landing-color-heading) solid;
    }
  }

  img {
    width: 100%;
    max-width: 65rem;
    height: auto;
    mask-image: none;
    z-index: 10;
  }
}

.features {
  position: relative;
  width: 100%;
  background: var(--landing-transition-gradient-end);

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(5, 1fr);
    max-width: 1096px;
    gap: 16px;
    margin: 0 auto;
    padding: 1rem;

    .mods {
      grid-column: 1 / 2;
      grid-row: 1 / 3;

      .table {
        margin-bottom: 1rem;
        overflow: hidden;
        max-height: 32rem;
      }

      h3, p {
        text-align: center;
      }

      h4 {
        margin: 0;
        color: var(--color-contrast);
      }

      .search-bar {
        width: 100%;
        padding: var(--gap-sm);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: var(--color-button-bg);
        border-radius: var(--radius-md);
        margin-bottom: 0.5rem;
        white-space: nowrap;

        .mini-input {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.5rem;
          padding: var(--gap-sm) var(--gap-md);
          border-radius: var(--radius-sm);
          background-color: var(--color-bg);
        }

        h4 {
          margin-left: 0.5rem;
        }
      }

      .row {
        display: grid;
        grid-template-columns: 3rem 2fr 1fr 3.75rem;
        padding: 0 var(--gap-sm);
        gap: 1rem;

        .cell {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--gap-sm) 0;

          .name {
            color: var(--color-contrast)
          }

          .description {
            font-size: var(--font-size-sm);
          }

          &.last {
            align-items: flex-end;
          }

          &.check {
            align-items: center;
            flex-direction: row;
          }
        }

        &:not(.header) {
          border-top: 1px solid var(--landing-border-color);
        }
      }

      .header {
        .cell {
          color: var(--color-base);
        }
      }
    }

    .multiplayer {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }

    .sharing {
      grid-column: 2 / 3;
      grid-row: 2 / 3;

      .table {
        height: 11rem;
        overflow: hidden;
        margin-bottom: 1rem;
      }

      h3, p {
        text-align: center;
      }

      .row {
        display: grid;
        grid-template-columns: 3rem 1fr 2fr;
        padding: 0 var(--gap-sm);
        gap: 1rem;

        .cell {
          display: flex;
          align-items: center;
          padding: var(--gap-sm) 0;

          .description {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }

        &:not(.header) {
          border-top: 1px solid var(--landing-border-color);
        }
      }

      .header {
        display: flex;
        flex-direction: row;
        gap: 0.25rem;
        padding: var(--gap-sm) var(--gap-sm);
      }

      .export-card {
        position: absolute;
        right: 1rem;
        top: 1.5rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: var(--gap-sm);
        gap: var(--gap-sm);
        border-radius: var(--radius-md);
        background-color: var(--color-button-bg);
        border: 1px solid var(--landing-border-color);
        margin-bottom: 1rem;
        width: 20rem;

        .info {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;

          .exporting {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
            width: 100%;

            .tag {
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 0.5rem;
              border-radius: var(--radius-sm);
            }

            .small-button {
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 0.5rem;
              padding: var(--gap-xs) var(--gap-md);
              border-radius: var(--radius-lg);
              border: 1px solid var(--landing-border-color);
              font-size: var(--font-size-sm);
            }
          }

          .name {
            font-size: var(--font-size-md);
            color: var(--color-contrast);
            margin: 0;
          }
        }
      }
    }

    .performance {
      grid-column: 1 / 2;
      grid-row: 3 / 4;

      .title {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 0.5rem;

        h3 {
          margin: 0;
          font-size: var(--font-size-lg);
        }
      }

      h3, p {
        text-align: center;
      }

      h3 {
        margin-top: var(--gap-lg) !important;
      }

      .table {
        height: 10rem;
        overflow: hidden;
      }

      .row {
        display: grid;
        grid-template-columns: 3rem 2fr 1fr 1fr;
        padding: 0 var(--gap-sm);
        gap: 1rem;

        .cell {
          display: flex;
          align-items: center;
          padding: var(--gap-sm) 0;
          color: var(--color-button-bg);

          &.important {
            color: var(--color-contrast);
          }
        }

        &:not(.header) {
          border-top: 1px solid var(--landing-border-color);
        }
      }

      .header {
        .cell {
          color: var(--color-base);
        }
      }

      .icon-logo {
        width: 3rem;
        height: 3rem;
        padding: 0.5rem;
        border-radius: var(--radius-sm);
        background-color: var(--color-button-bg);

        &.modrinth {
          background-color: var(--color-brand) !important;
          border: 1px solid var(--color-accent-contrast) !important;

          .icon {
            width: 2rem;
            height: 2rem;
            z-index: 0;

            :deep(svg) {
              width: 2rem;
              height: 2rem;
            }

            :deep(path) {
              fill: var(--color-accent-contrast) !important;
            }
          }
        }
      }
    }

    .importing {
      position: relative;
      grid-column: 1 / 2;
      grid-row: 4 / 5;

      .icon-logo {
        position: absolute;
        top: calc(50% - 3rem);
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 100%;
      }

      .outer-ring {
        position: absolute;
        top: calc(50% - 3rem);
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .ring {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;

        .base-ring {
          position: absolute;
          border-radius: 100%;
          top: calc(50% - 3rem);
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: -1;
          border: 1px solid var(--landing-border-color);
        }

        .first-ring {
          @extend .base-ring;
          width: 20rem;
          height: 20rem;
          background: radial-gradient(50% 50.00% at 50% 50.00%, rgba(5, 206, 69, 0.19) 0%, rgba(15, 19, 49, 0.25) 100%);
        }

        .second-ring {
          @extend .base-ring;
          width: 30rem;
          height: 30rem;
          opacity: 0.75;
          background: radial-gradient(50% 50.00% at 50% 50.00%, rgba(5, 206, 69, 0.19) 0%, rgba(15, 19, 49, 0.25) 100%), radial-gradient(50% 50.00% at 50% 50.00%, rgba(44, 48, 79, 0.25) 0%, rgba(32, 35, 50, 0.19) 100%);
        }

        .third-ring {
          @extend .base-ring;
          width: 40rem;
          height: 40rem;
          opacity: 0.5;
          background: radial-gradient(50% 50.00% at 50% 50.00%, rgba(44, 48, 79, 0.25) 0%, rgba(32, 35, 50, 0.19) 100%);
        }
      }

      .inner-ring {
        position: relative;
      }

      .launcher-badge {
        position: absolute;
        background-color: var(--landing-transition-gradient-end);
        width: 4rem;
        height: 4rem;
        padding: 0.75rem;
        border-radius: 100%;
        z-index: 10;

        &.top-left {
          top: calc(15% - 3rem);
          left: calc(50% - 11rem);
        }

        &.top-right {
          top: calc(15% - 3rem);
          right: calc(50% - 11rem);
        }

        &.bottom-left {
          bottom: calc(15% + 3rem);
          left: calc(50% - 11rem);
        }

        &.bottom-right {
          bottom: calc(15% + 3rem);
          right: calc(50% - 11rem);
        }

        &.center {
          top: calc(50% - 3rem);
          left: 50%;
          transform: translate(-50%, -50%);
        }

        svg {
          width: 2.5rem;
          height: 2.5rem;
        }

        img {
          width: 2.5rem;
          height: 2.5rem;
        }
      }

      .text {
        position: absolute;
        text-align: center;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 100%;
        padding: var(--gap-xl);
      }
    }

    .website {
      grid-column: 2 / 3;
      grid-row: 3 / 5;
      text-align: center;
      padding: 0 !important;

      position: relative;

      .projects-showcase {
        margin-top: 10rem;
        z-index: 3;
        text-align: left;

        .row {
          --gap: var(--gap-md);

          width: 100vw;
          gap: var(--gap);
          margin-bottom: var(--gap);
          display: flex;
          overflow: hidden;
          user-select: none;

          &:hover {
            .row__content {
              animation-play-state: paused !important;
            }
          }

          .row__content {
            flex-shrink: 0;
            display: flex;
            min-width: 100%;
            gap: var(--gap);
            animation: scroll 40s linear infinite;

            @media (prefers-reduced-motion) {
              animation-play-state: paused !important;
            }

            @keyframes scroll {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(calc(-100%));
              }
            }

            &.offset {
              animation: scroll-inverse 40s linear infinite;
              transform: translateX(-100%);

              @keyframes scroll-inverse {
                from {
                  transform: translateX(calc(-100%));
                }
                to {
                  transform: translateX(calc(0%));
                }
              }
            }
          }

          .project {
            position: relative;
            display: flex;

            cursor: pointer;
            padding: 1rem;
            gap: 1rem;
            border-radius: 1rem;
            border: 1px solid var(--landing-border-color);
            transition: background 0.5s ease-in-out, transform 0.05s ease-in-out;
            // Removed due to lag on mobile :(
            background: var(--landing-blob-gradient);


            img {
              height: 3rem;
            }

            .project-info {
              box-sizing: border-box;
            }

            .title {
              color: var(--landing-color-heading);
              max-width: 13.75rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin: 0;
              font-weight: 600;
              font-size: 1.25rem;
              line-height: 110%;
              display: block;
            }

            .description {
              width: 13.75rem;

              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;

              font-weight: 500;
              font-size: 0.875rem;
              line-height: 125%;
              margin: 0.25rem 0 0;
            }
          }
        }
      }

      .ellipsis {
        position: absolute;
        top: 2rem;
        left: 50%;
        height: 150%;
        z-index: -1;
        aspect-ratio: 1;
        border-radius: 100%;
        transform: translate(-50%, 2rem);
        background: var(--landing-blob-gradient);
        border: 1px solid var(--landing-border-color)
      }

      .icon-logo {
        position: absolute;
        top: 2rem;
        left: 50%;
        transform: translate(-50%, 0);
        z-index: 4;
      }

      p {
        padding: var(--gap-xl);
        padding-top: 0;
      }
    }

    .feature {
      padding: var(--gap-xl);
      z-index: 1;
      background: radial-gradient(50% 50.00% at 50% 50.00%, rgba(44, 48, 79, 0.35) 0%, rgba(32, 35, 50, 0.27) 100%);
      box-shadow: 2px 2px 12px 0px rgba(0, 0, 0, 0.16), 2px 2px 64px 0px rgba(57, 61, 94, 0.45) inset;
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      max-width: 540px;
      width: 100%;
      overflow: hidden;

      .card {
        padding: var(--gap-md);
        background: var(--landing-card-bg);
        border-radius: 1rem;
      }

      .additional-label {
        width: fit-content;
        padding: 0.5rem 0.75rem;
        margin-bottom: 0.5rem;
        background: var(--landing-blue-label-bg);
        color: var(--landing-blue-label);
        border-radius: 6px;
        font-weight: 700;
        font-size: 1rem;
      }

      h3, p {
        margin: 0;
      }

      h3 {
        font-size: var(--font-size-xl);
        color: var(--landing-color-heading);
        margin-bottom: 0.375rem;
      }

      p {
        color: var(--landing-color-subheading);
      }
    }
  }
}

.table {
  display: grid;
  border: 1px solid var(--landing-border-color);
  gap: 0.25rem;
  overflow: hidden;
}

.icon-logo {
  background: var(--color-accent-contrast);
  width: 5rem;
  height: 5rem;
  padding: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--landing-border-color);
  border-radius: var(--radius-lg);

  .icon {
    margin: auto;
    height: 3.5rem;

    :deep(svg) {
      width: 3.5rem;
      height: 3.5rem;
    }

    :deep(.rotate) {
      animation: none !important;
    }
  }
}

.gradient-border {
  position: relative;
  border-radius: 1rem;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 1px;
    z-index: -1;
    border-radius: 1rem;
    background: var(--landing-border-gradient);

    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
}

.bottom-transition {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30rem;
  background: linear-gradient(
      0deg,
      var(--landing-transition-gradient-end) 0%,
      var(--landing-transition-gradient-start) 100%
  );
}

@media screen and (max-width: 1024px) {
  .feature-grid {
    display: flex !important;
    flex-direction: column;
    align-items: center;
  }

  .importing {
    height: 20rem;
  }

  .main-header {
    font-size: 4rem !important;
  }

  .main-subheader {
    font-size: 1.25rem !important;
  }
}

@media screen and (max-width: 746px) {
  .main-header {
    font-size: 3rem !important;
  }

  .main-subheader {
    font-size: 1.1rem !important;
  }
}
</style>
