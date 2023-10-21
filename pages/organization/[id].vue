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
  ModalReport
} from 'omorphia'
import Avatar from '~/components/ui/Avatar.vue'
import Breadcrumbs from '~/components/ui/Breadcrumbs.vue'
import CopyCode from "~/components/ui/CopyCode.vue";

const auth = await useAuth()
const data = useNuxtApp()
const route = useRoute()

const organization = shallowRef(
  await useAsyncData(`organization/${route.params.id}`, () =>
    useBaseFetch(`organization/${route.params.id}`)
  ).then((res) => res.data)
)

const projects = shallowRef(
    await useAsyncData(`organization/${route.params.id}/projects`, () =>
        useBaseFetch(`organization/${route.params.id}/projects`)
    ).then((res) => res.data)
)

const patchOrganization = async (resData, quiet = false) => {
  let result = false
  startLoading()

  try {
    await useBaseFetch(`organization/${organization.value.id}`, {
      method: 'PATCH',
      body: resData,
    })

    await resetOrganization();

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

const currentMember = ref(
    auth.value.user ? organization.value.members.find((x) => x.user.id === auth.value.user.id) : null
)
</script>

<template>
  <ShareModal
    ref="shareModal"
    :shareTitle="organization.title"
    :shareText="`Check out the cool projects ${organization.title} is making on Modrinth!`"
    link
  />
  <ModalReport
    ref="reportModal"
    item-type="organization"
    :item-id="organization.id"
    :report-types="['Spam', 'Copyright', 'Inappropriate', 'Malicious', 'Name-squatting', 'Poor description', 'Invalid metadata', 'Other']"
  />
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
          :current-member="currentMember"
      />
    </div>
  </div>
  <div v-else class="normal-page">
    <div class="normal-page__header">
      <div class="page-header">
        <Avatar class="page-header__icon" :src="organization.icon_url" size="md" />
        <div class="page-header__text">
          <div class="title">
            <h1>{{ organization.title }}</h1>
          </div>
          <div class="markdown-body">
            <p>
              {{ organization.description }}
            </p>
          </div>
          <div class="stats">
            <div class="stat">
              <DownloadIcon />
              <span>{{ formatNumber(projects.reduce((a, b) => a + b.downloads, 0)) }} Downloads</span>
            </div>
            <div class="stat">
              <HeartIcon />
              <span>{{ formatNumber(projects.reduce((a, b) => a + b.followers, 0)) }} Followers</span>
            </div>
          </div>
          <!--
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
          -->
        </div>
        <div class="page-header__buttons">
          <div class="group">
            <Button @click="$refs.reportModal.show()">
              <ReportIcon />
              Report
            </Button>
            <Button @click="$refs.shareModal.show(`https://modrinth.com/organization/${organization.title}`)">
              <ShareIcon />
              Share
            </Button>
          </div>
          <div class="group">
            <CopyCode :text="organization.id"/>
          </div>
        </div>
      </div>
      <Promotion />
    </div>
    <NuxtPage
        v-model:organization="organization"
        v-model:projects="projects"
    />
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
  a, .link-like {
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
      margin: .3rem;
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

</style>
