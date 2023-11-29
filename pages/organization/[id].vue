<script setup>
import {
  SearchIcon,
  Card,
  Button,
  LinkIcon,
  Promotion,
  ShareIcon,
  HeartIcon,
  CurrencyIcon,
  ReportIcon,
  SunriseIcon,
  GitHubIcon,
  DownloadIcon,
  SettingsIcon,
  UsersIcon,
  ListIcon,
  DashboardIcon,
  ChartIcon,
  formatNumber,
  ShareModal,
  ReportModal, BoxIcon, ModrinthIcon, ScaleIcon, ServerIcon, MoreHorizontalIcon, OverflowMenu,
} from 'omorphia'
import Avatar from '~/components/ui/Avatar.vue'
import Breadcrumbs from '~/components/ui/Breadcrumbs.vue'
import CopyCode from '~/components/ui/CopyCode.vue'
import WorldIcon from "assets/images/utils/world.svg";
import FilterIcon from "assets/images/utils/filter.svg";
import ImageIcon from "assets/images/utils/image.svg";
import GlassesIcon from "assets/images/utils/glasses.svg";
import FlameIcon from "assets/images/utils/flame.svg";
import PackageIcon from "assets/images/utils/package-open.svg";
import BracesIcon from "assets/images/utils/braces.svg";
import PageBar from "~/components/ui/PageBar.vue";

const auth = await useAuth()
const data = useNuxtApp()
const route = useRoute()

const organization = shallowRef(
  await useAsyncData(`organization/${route.params.id}`, () =>
    useBaseFetch(`organization/${route.params.id}`)
  ).then((res) => res.data)
)

if (!organization.value) {
  throw createError({
    fatal: true,
    statusCode: 404,
    message: 'Organization not found',
  })
}

const projects = shallowRef(
  await useAsyncData(`organization/${route.params.id}/projects`, () =>
    useBaseFetch(`organization/${route.params.id}/projects`)
  ).then((res) => res.data)
)

const selectedFilter = ref('all')

const filterOptions = computed(() =>
    projects.value.map((p) => p.project_type).filter((v, i, a) => a.indexOf(v) === i)
)

const patchOrganization = async (resData, quiet = false) => {
  let result = false
  startLoading()

  try {
    await useBaseFetch(`organization/${organization.value.id}`, {
      method: 'PATCH',
      body: resData,
    })

    await resetOrganization()

    result = true
    if (!quiet) {
      data.$notify({
        group: 'main',
        title: 'Organization updated',
        text: 'Your organization has been updated.',
        type: 'success',
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (err) {
    data.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err,
      type: 'error',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  stopLoading()

  return result
}

const patchIcon = async (icon) => {
  let result = false
  startLoading()

  try {
    await useBaseFetch(
      `organization/${organization.value.id}/icon?ext=${
        icon.type.split('/')[icon.type.split('/').length - 1]
      }`,
      {
        method: 'PATCH',
        body: icon,
      }
    )
    await resetOrganization()
    result = true
    data.$notify({
      group: 'main',
      title: 'Organization icon updated',
      text: "Your organization's icon has been updated.",
      type: 'success',
    })
  } catch (err) {
    data.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err,
      type: 'error',
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  stopLoading()
  return result
}

const deleteIcon = async () => {
  await useBaseFetch(`organization/${organization.value.id}/icon`, {
    method: 'DELETE',
  })
  await resetOrganization()
  this.$notify({
    group: 'main',
    title: 'organization icon removed',
    text: "Your Organization's icon has been removed.",
    type: 'success',
  })
}

const resetOrganization = async () => {
  organization.value = await useBaseFetch(`organization/${organization.value.id}`)
  /*
  projects.value = await useBaseFetch(
    `projects?ids=[${organization.value.projects.map((p) => `"${p}"`).join(',')}]`
  )
   */
}

const currentMember = ref(
  auth.value.user && organization.value ? organization.value.members.find((x) => x.user.id === auth.value.user.id) : null
)

if (
    !currentMember.value &&
    auth.value.user &&
    tags.value.staffRoles.includes(auth.value.user.role)
) {
    currentMember.value = {
        user: auth.value.user,
        role: auth.value.role,
        permissions: auth.value.user.role === 'admin' ? 1023 : 12,
        accepted: true,
        payouts_split: 0,
        avatar_url: auth.value.user.avatar_url,
        name: auth.value.user.username,
    }
}
</script>

<template>
  <ShareModal
    v-if="organization"
    ref="shareModal"
    :share-title="organization.title"
    :share-text="`Check out the cool projects ${organization.title} is making on Modrinth!`"
    link
  />
  <ReportModal
    v-if="organization"
    ref="reportModal"
    item-type="organization"
    :item-id="organization.id"
    :report-types="[
      'Spam',
      'Copyright',
      'Inappropriate',
      'Malicious',
      'Name-squatting',
      'Poor description',
      'Invalid metadata',
      'Other',
    ]"
  />
  <div v-if="organization" class="normal-page">
    <div class="organization-header">
      <div class="banner-img">
        <div class="banner-content">
          <Avatar
              :src="organization.icon_url"
              size="lg"
              :alt="organization.title"
          />
          <div class="user-text">
            <div class="title">
              <h2 class="username">
                {{ organization.title }}
              </h2>
            </div>
            <div class="markdown-body">
              <p>
                {{ organization.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <PageBar>
        <span class="page-bar__title"><FilterIcon /> Filter by</span>
        <div class="nav-button button-base" :class="{'router-link-exact-active': selectedFilter === 'all'}" @click="() => selectedFilter = 'all'"><FlameIcon />All</div>
        <template v-for="(filter, index) in filterOptions" :key="filter">
          <div class="nav-button button-base" v-if="filter === selectedFilter || index < 2" :class="{'router-link-exact-active': selectedFilter === filter}" @click="() => selectedFilter = filter">
            <template v-if="filter === 'mod'"><BoxIcon /> Mods </template>
            <template v-if="filter === 'datapack'"><BracesIcon /> Data Packs </template>
            <template v-if="filter === 'resourcepack'"><ImageIcon /> Resource Packs </template>
            <template v-if="filter === 'shader'"><GlassesIcon /> Shaders </template>
            <template v-if="filter === 'world'"><WorldIcon /> Worlds </template>
            <template v-if="filter === 'plugin'"><ServerIcon /> Plugins </template>
            <template v-if="filter === 'modpack+'"><PackageIcon /> Modpacks </template>
          </div>
        </template>
        <OverflowMenu
            v-if="filterOptions.length > 2 && filterOptions.slice(2, filterOptions.length).filter((filter) => filter !== selectedFilter).length > 0"
            class="nav-button button-base"
            :options="filterOptions.slice(2, filterOptions.length).filter((filter) => filter !== selectedFilter).map(
                  (filter) => ({
                  'id': filter,
                  'action': () => {
                    selectedFilter = filter
                  },
                })
              )"
            position="right"
            direction="down"
        >
          <MoreHorizontalIcon/>
          <template #mod> <BoxIcon /> Mods </template>
          <template #datapack> <BracesIcon /> Data Packs </template>
          <template #resourcepack> <ImageIcon /> Resource Packs </template>
          <template #shader> <GlassesIcon /> Shaders </template>
          <template #world> <WorldIcon /> Worlds </template>
          <template #plugin> <ServerIcon /> Plugins </template>
          <template #modpack> <PackageIcon /> Modpacks </template>
        </OverflowMenu>
      </PageBar>
    </div>
    <div class="settings-page__sidebar" v-if="$route.name.startsWith('organization-id-settings')">
      <div class="settings-page__header">
        <Breadcrumbs
          current-title="Settings"
          :link-stack="[
            {
              href: `/organization/${organization.title}`,
              label: organization.title,
              allowTrimming: true,
            },
          ]"
        />
        <div class="settings-header">
          <Avatar
            :src="organization.icon_url"
            :alt="organization.title"
            size="sm"
            class="settings-header__icon"
          />
          <div class="settings-header__text">
            <h1 class="wrap-as-needed">
              {{ organization.title }}
            </h1>
          </div>
        </div>
      </div>
      <div class="settings-nav">
        <NuxtLink :to="`/organization/${organization.title}/settings`">
          <SettingsIcon /> General
        </NuxtLink>
        <NuxtLink :to="`/organization/${organization.title}/settings/members`">
          <UsersIcon /> Members
        </NuxtLink>
        <NuxtLink :to="`/organization/${organization.title}/settings/projects`">
          <ListIcon /> Projects
        </NuxtLink>
        <NuxtLink :to="`/organization/${organization.title}/settings/analytics`">
          <ChartIcon /> Analytics
        </NuxtLink>
      </div>
    </div>
    <NuxtPage v-model:organization="organization" v-model:projects="projects" v-model:typeFilter="selectedFilter"/>
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  grid-area: sidebar;
}

.content {
  grid-area: content;
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
}

.banner {
  grid-area: banner;
  display: flex;
  flex-direction: column;
  padding: var(--gap-xl);
  gap: var(--gap-md);
  overflow: hidden;
  margin-bottom: 0;

  .color {
    height: 10rem;
    background-color: var(--color-brand);
    margin: -1.5rem -1.5rem 0 -1.5rem;
  }

  h1 {
    margin: 0 0 var(--gap-sm) 0;
  }

  .icon {
    margin-top: -4rem;
  }

  .info {
    display: flex;
    flex-direction: column;
  }

  .links {
    display: flex;
    flex-direction: row;

    a {
      margin: 0 0.5rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--gap-xs);
      text-decoration: underline;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .avatar-row {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: var(--gap-md);

    .input-group {
      flex-grow: 1;
    }
  }
}

.iconified-field {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--gap-xs);

  p {
    margin: 0;
  }

  :deep(.avatar) {
    --size: 1.5rem;
  }
}

.community-post-list {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
  padding: var(--gap-xl);

  h2 {
    margin: 0;
  }

  .community-post {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    .author {
      margin-left: 1rem;
    }
  }
}

.all-projects {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);

  .search-card {
    margin-bottom: 0;
    padding: var(--gap-lg);
  }

  .projects {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
  }
}

.nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: var(--gap-md);
}

.settings-page {
  .settings-page__content {
    margin-top: calc(2em + var(--gap-lg) + var(--gap-sm));
  }
}

.settings-nav {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
  margin-bottom: var(--gap-lg);
  padding-inline: calc(var(--gap-xl) - 1.1rem - 0.5rem);
  flex-wrap: wrap;

  a {
    display: flex;
    align-items: center;
    padding: var(--gap-sm) var(--gap-md);
    border-radius: var(--radius-md);
    font-weight: 500;

    svg {
      margin-right: 0.5rem;
    }

    &.router-link-exact-active {
      background-color: var(--color-button-bg);
      color: var(--color-contrast);
    }
  }
}

.settings-header {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-card-sm);
  align-items: center;
  margin-bottom: var(--spacing-card-bg);

  .settings-header__icon {
    flex-shrink: 0;
  }

  .settings-header__text {
    h1 {
      font-size: var(--font-size-md);
      margin-top: 0;
      margin-bottom: var(--spacing-card-sm);
    }
  }
}

.links {
  a,
  .link-like {
    display: inline-flex;
    align-items: center;
    border-radius: 1rem;

    svg,
    img {
      height: 1rem;
      width: 1rem;
    }

    span {
      margin-left: var(--gap-xs);
    }

    &:not(:last-child)::after {
      content: '';
      margin: 0.3rem;
    }
  }

  a {
    &:focus-visible,
    &:hover {
      svg,
      img,
      span {
        color: var(--color-heading);
      }
    }

    &:active {
      svg,
      img,
      span {
        color: var(--color-text-dark);
      }
    }
  }
}

.popout-heading {
  padding: var(--gap-sm) var(--gap-md);
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--color-text);
}

.popout-checkbox {
  padding: var(--gap-sm) var(--gap-md);
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-sm);

  .stat {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--gap-sm);
    border-radius: var(--radius-md);
    background: var(--color-raised-bg);
    text-align: center;

    box-shadow: var(--shadow-raised);
    padding: var(--gap-xs) var(--gap-sm);
    border: 1px solid var(--color-button-bg);
  }
}

.organization-header {
  grid-area: header;
  .banner-img {
    width: 100%;
    height: 12rem;
    background: var(--color-raised-bg) url("https://launcher-files.modrinth.com/assets/maze-bg.png") no-repeat center;
    background-size: cover;
    border-radius: var(--radius-md);
    border: 1px var(--color-button-bg) solid;
    position: relative;
    margin-bottom: calc(4.5rem + var(--gap-md));

    .banner-content {
      position: absolute;
      left: var(--gap-md);
      bottom: -4.5rem;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      gap: var(--gap-sm);

      .user-text {
        height: 4.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .title {
        display: inline-flex;
        gap: var(--gap-sm);
        align-items: baseline;

        > * {
          margin: 0;
        }
      }
    }
  }
}


.filter-row {
  margin-bottom: 1rem;

  .title {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem 0.75rem 0;
    color: var(--color-secondary);

    svg {
      margin-right: 0.5rem;
    }
  }
}

.new-nav {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 2px solid var(--color-button-bg);

  svg {
    height: 1.2rem;
    width: 1.2rem;
  }

  a, .link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    border-bottom: 3px solid transparent;
    padding: 0.75rem 1rem;
    margin-bottom: -2px;

    &.router-link-exact-active {
      color: var(--color-contrast);
      border-color: var(--color-brand);
    }
  }
}
</style>
