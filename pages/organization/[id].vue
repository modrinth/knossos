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
  ChartIcon
} from 'omorphia'
import Avatar from '~/components/ui/Avatar.vue'
import YoutubeIcon from 'assets/images/utils/youtube.svg'
import DiscordIcon from 'assets/images/external/discord.svg'
import NavRow from '~/components/ui/NavRow.vue'
import Breadcrumbs from '~/components/ui/Breadcrumbs.vue'

const data = useNuxtApp()
const route = useRoute()

const organization = shallowRef(
  await useAsyncData(`organization/${route.params.id}`, () =>
    useBaseFetch(`organization/${route.params.id}`)
  ).then((res) => res.data)
)

const projects = shallowRef([])

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

const hasPermission = computed(() => {
  const EDIT_DETAILS = 1 << 2
  return true
})

</script>

<template>
  <div v-if="$route.name.startsWith('organization-id-settings')" class="settings-page">
    <div class="settings-page__sidebar">
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
        <NuxtLink :to="`/organization/${organization.title}/settings`"> <SettingsIcon /> General </NuxtLink>
        <NuxtLink :to="`/organization/${organization.title}/settings/members`"> <UsersIcon /> Members </NuxtLink>
        <NuxtLink :to="`/organization/${organization.title}/settings/projects`"> <ListIcon /> Projects </NuxtLink>
        <NuxtLink :to="`/organization/${organization.title}/settings/collections`"> <DashboardIcon /> Collections </NuxtLink>
        <NuxtLink :to="`/organization/${organization.title}/settings/analytics`"> <ChartIcon /> Analytics </NuxtLink>
      </div>
    </div>
    <div class="settings-page__content">
      <NuxtPage
          v-model:organization="organization"
          v-model:projects="projects"
          :patch-organization="patchOrganization"
          :patch-icon="patchIcon"
          :delete-icon="deleteIcon"
      />
    </div>
  </div>
  <div v-else class="normal-page no-sidebar">
    <div class="normal-page__header">
      <div class="page-header">
        <Avatar class="page-header__icon" :src="organization.icon_url" size="md" circle />
        <div class="page-header__text">
          <div class="title">
            <h1>{{ organization.title }}</h1>
            <Button icon-only> <ShareIcon /> </Button>
          </div>
          <div class="links">
            <div class="link-like">
              <DownloadIcon />
              <span>{{ projects }} Downloads</span>
            </div>
            <div class="link-like">
              <HeartIcon />
              <span>1.9k Followers</span>
            </div>
          </div>
          <div class="links">
            <a href="https://docs.terrarium.earth">
              <LinkIcon />
              <span>Website</span>
            </a>
            <a href="https://github.com">
              <GitHubIcon />
              <span>Github</span>
            </a>
            <a href="https://youtube.com">
              <YoutubeIcon />
              <span>Youtube</span>
            </a>
            <a href="https://discord.gg">
              <DiscordIcon />
              <span>Discord</span>
            </a>
          </div>
        </div>
        <div class="page-header__buttons">
          <div class="group">
            <Button>
              <HeartIcon />
              Follow
            </Button>
            <Button>
              <ReportIcon />
              Report
            </Button>
          </div>
          <div class="group">
            <Button>
              <HeartIcon />
              Subscribe
            </Button>
            <Button>
              <CurrencyIcon />
              Donate
            </Button>
          </div>
        </div>
      </div>
      <Promotion />
      <Card class="nav">
        <NavRow
          :links="[
            {
              label: 'Overview',
              href: `/organization/${organization.title}/`,
            },
            {
              label: 'Projects',
              href: `/organization/${organization.title}/projects`,
            },
            {
              label: 'Collections',
              href: `/organization/${organization.title}/collections`,
            },
            {
              label: 'Members',
              href: `/organization/${organization.title}/members`,
            },
          ]"
        />
        <Button @click="$router.push(`/organization/${organization.title}/settings`)">
          <SettingsIcon />
          Settings
        </Button>
      </Card>
    </div>
    <div class="normal-page__content">
      <NuxtPage
          v-model:organization="organization"
          v-model:projects="projects"
      />
    </div>
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

.socials {
  display: flex;
  flex-direction: column;
  padding: var(--gap-xl);
  gap: var(--gap-sm);

  .social {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--gap-xl);

    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--gap-sm);
      opacity: 0.65;

      svg {
        width: 1.25rem;
        height: 1.25rem;
      }
    }

    a,
    .stat {
      text-align: right;
      width: 100%;
      overflow: hidden;
      text-overflow: fade(10%);
    }

    .stat {
      font-weight: bold;
    }
  }

  hr {
    margin: var(--gap-sm) 0;
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

</style>
