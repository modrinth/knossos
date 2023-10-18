<template>
  <div v-if="user">
    <Head>
      <Title>{{ user.username + ' - Modrinth' }}</Title>
      <Meta name="og:title" :content="user.username" />
      <Meta name="description" :content="metaDescription" />
      <Meta name="og:type" content="website" />
      <Meta name="apple-mobile-web-app-title" :content="metaDescription" />
      <Meta name="og:description" :content="metaDescription" />
      <Meta
        name="og:image"
        :content="user.avatar_url ? user.avatar_url : 'https://cdn.modrinth.com/placeholder.png'"
      />
    </Head>
    <ModalCreation ref="modal_creation" />
    <ModalReport ref="modal_report" :item-id="user.id" item-type="user" />
    <div class="normal-page">
      <div class="page-header">
        <Avatar
          :src="previewImage ? previewImage : user.avatar_url"
          size="md"
          circle
          class="page-header__icon"
          :alt="user.username"
        />
        <div class="page-header__text">
          <div class="title">
            <h1 class="username">
              {{ user.username }}
            </h1>
            <ModrinthIcon v-if="user.role === 'admin'" v-tooltip="'Modrinth team'" class="icon" />
            <ScaleIcon
              v-else-if="user.role === 'moderator'"
              v-tooltip="'Moderator'"
              class="icon moderator"
            />
            <BoxIcon
              v-else-if="user.role === 'developer'"
              v-tooltip="'Creator'"
              class="icon creator"
            />
          </div>
          <div class="markdown-body">
            <p>
              {{ user.bio }}
            </p>
          </div>
          <div class="stats">
            <div class="stat">
              <HeartIcon aria-hidden="true" />
              {{ sumFollows }} followers
            </div>
            <div class="stat">
              <DownloadIcon aria-hidden="true" />
              {{ sumDownloads }} downloads
            </div>
            <div class="stat">
              <SunriseIcon aria-hidden="true" />
              Joined {{ fromNow(user.created) }}
            </div>
          </div>
        </div>
      </div>
      <div class="normal-page__sidebar">
        <div class="universal-card">
          <h2>Badges</h2>
          <div class="badges-container">
            <div class="badge">
              <BadgeModrinthTeam />
            </div>
            <div class="badge">
              <Badge100kDownloads />
            </div>
            <div class="badge">
              <Badge1MDownloads />
            </div>
          </div>
        </div>
      </div>
      <div class="normal-page__content">
        <Promotion />
        <nav class="navigation-card">
          <NavRow
            :links="[
              {
                label: 'all',
                href: `/user/${user.username}`,
              },
              ...projectTypes.map((x) => {
                return {
                  label: $formatProjectType(x) + 's',
                  href: `/user/${user.username}/${x}s`,
                }
              }),
            ]"
          />
          <div class="input-group">
            <NuxtLink
              v-if="auth.user && auth.user.id === user.id"
              class="iconified-button"
              to="/projects"
            >
              <SettingsIcon />
              Manage projects
            </NuxtLink>
            <button
              v-tooltip="$capitalizeString(cosmetics.searchDisplayMode.user) + ' view'"
              :aria-label="$capitalizeString(cosmetics.searchDisplayMode.user) + ' view'"
              class="square-button"
              @click="cycleSearchDisplayMode()"
            >
              <GridIcon v-if="cosmetics.searchDisplayMode.user === 'grid'" />
              <ImageIcon v-else-if="cosmetics.searchDisplayMode.user === 'gallery'" />
              <ListIcon v-else />
            </button>
          </div>
        </nav>
        <div
          v-if="projects.length > 0"
          class="project-list"
          :class="'display-mode--' + cosmetics.searchDisplayMode.user"
        >
          <ProjectCard
            v-for="project in (route.params.projectType !== undefined
              ? projects.filter(
                  (x) =>
                    x.project_type ===
                    route.params.projectType.substr(0, route.params.projectType.length - 1)
                )
              : projects
            )
              .slice()
              .sort((a, b) => b.downloads - a.downloads)"
            :id="project.slug || project.id"
            :key="project.id"
            :name="project.title"
            :display="cosmetics.searchDisplayMode.user"
            :featured-image="
              project.gallery
                .slice()
                .sort((a, b) => b.featured - a.featured)
                .map((x) => x.url)[0]
            "
            :description="project.description"
            :created-at="project.published"
            :updated-at="project.updated"
            :downloads="project.downloads.toString()"
            :follows="project.followers.toString()"
            :icon-url="project.icon_url"
            :categories="project.categories"
            :client-side="project.client_side"
            :server-side="project.server_side"
            :status="
              auth.user && (auth.user.id === user.id || tags.staffRoles.includes(auth.user.role))
                ? project.status
                : null
            "
            :type="project.project_type"
            :color="project.color"
          />
        </div>
        <div v-else class="error">
          <UpToDate class="icon" /><br />
          <span v-if="auth.user && auth.user.id === user.id" class="text">
            You don't have any projects.<br />
            Would you like to
            <a class="link" @click.prevent="$refs.modal_creation.show()"> create one</a>?
          </span>
          <span v-else class="text">This user has no projects!</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  Promotion,
  ModrinthIcon,
  BoxIcon,
  ScaleIcon,
  HeartIcon,
  DownloadIcon,
  SunriseIcon,
  formatNumber,
} from 'omorphia'
import ProjectCard from '~/components/ui/ProjectCard.vue'
import SettingsIcon from '~/assets/images/utils/settings.svg'
import UpToDate from '~/assets/images/illustrations/up_to_date.svg'
import GridIcon from '~/assets/images/utils/grid.svg'
import ListIcon from '~/assets/images/utils/list.svg'
import ImageIcon from '~/assets/images/utils/image.svg'
import ModalReport from '~/components/ui/ModalReport.vue'
import ModalCreation from '~/components/ui/ModalCreation.vue'
import NavRow from '~/components/ui/NavRow.vue'
import Avatar from '~/components/ui/Avatar.vue'

import Badge1MDownloads from '~/assets/images/badges/downloads-1m.svg'
import Badge10MDownloads from '~/assets/images/badges/downloads-10m.svg'
import Badge100kDownloads from '~/assets/images/badges/downloads-100k.svg'
import Badge100MDownloads from '~/assets/images/badges/downloads-100m.svg'
import BadgeEarlyDataPackAdopter from '~/assets/images/badges/early-datapack-adopters.svg'
import BadgeEarlyModpackAdopter from '~/assets/images/badges/early-modpack-adopters.svg'
import BadgeEarlyPluginAdopter from '~/assets/images/badges/early-plugin-adopters.svg'
import BadgeEarlyResourcePackAdopter from '~/assets/images/badges/early-resourcepack-adopters.svg'
import BadgeEarlyShadersAdopter from '~/assets/images/badges/early-shaders-adopters.svg'
import BadgeModrinthModerator from '~/assets/images/badges/modrinth-moderator.svg'
import BadgeModrinthTeam from '~/assets/images/badges/modrinth-team.svg'

const data = useNuxtApp()
const route = useRoute()
const auth = await useAuth()
const cosmetics = useCosmetics()
const tags = useTags()

let user, projects
try {
  ;[{ data: user }, { data: projects }] = await Promise.all([
    useAsyncData(`user/${route.params.id}`, () => useBaseFetch(`user/${route.params.id}`)),
    useAsyncData(
      `user/${route.params.id}/projects`,
      () => useBaseFetch(`user/${route.params.id}/projects`),
      {
        transform: (projects) => {
          for (const project of projects) {
            project.categories = project.categories.concat(project.loaders)
            project.project_type = data.$getProjectTypeForUrl(
              project.project_type,
              project.categories,
              tags.value
            )
          }

          return projects
        },
      }
    ),
  ])
} catch {
  throw createError({
    fatal: true,
    statusCode: 404,
    message: 'User not found',
  })
}

if (!user.value) {
  throw createError({
    fatal: true,
    statusCode: 404,
    message: 'User not found',
  })
}

if (user.value.username !== route.params.id) {
  await navigateTo(`/user/${user.value.username}`, { redirectCode: 301 })
}

const metaDescription = ref(
  user.value.bio
    ? `${user.value.bio} - Download ${user.value.username}'s projects on Modrinth`
    : `Download ${user.value.username}'s projects on Modrinth`
)

const projectTypes = computed(() => {
  const obj = {}

  for (const project of projects.value) {
    obj[project.project_type] = true
  }

  return Object.keys(obj)
})
const sumDownloads = computed(() => {
  let sum = 0

  for (const project of projects.value) {
    sum += project.downloads
  }

  return data.$formatNumber(sum)
})
const sumFollows = computed(() => {
  let sum = 0

  for (const project of projects.value) {
    sum += project.followers
  }

  return data.$formatNumber(sum)
})

const isEditing = ref(false)
const icon = shallowRef(null)
const previewImage = shallowRef(null)

function showPreviewImage(files) {
  const reader = new FileReader()
  icon.value = files[0]
  reader.readAsDataURL(icon.value)
  reader.onload = (event) => {
    previewImage.value = event.target.result
  }
}

async function saveChanges() {
  startLoading()
  try {
    if (icon.value) {
      await useBaseFetch(
        `user/${auth.value.user.id}/icon?ext=${
          icon.value.type.split('/')[icon.value.type.split('/').length - 1]
        }`,
        {
          method: 'PATCH',
          body: icon.value,
        }
      )
    }

    const reqData = {
      email: user.value.email,
      bio: user.value.bio,
    }
    if (user.value.username !== auth.value.user.username) {
      reqData.username = user.value.username
    }

    await useBaseFetch(`user/${auth.value.user.id}`, {
      method: 'PATCH',
      body: reqData,
    })
    await useAuth(auth.value.token)

    isEditing.value = false
  } catch (err) {
    console.error(err)
    data.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err.data.description,
      type: 'error',
    })
  }
  stopLoading()
}

function cycleSearchDisplayMode() {
  cosmetics.value.searchDisplayMode.user = data.$cycleValue(
    cosmetics.value.searchDisplayMode.user,
    tags.value.projectViewModes
  )
  saveCosmetics()
}
</script>
<script>
export default defineNuxtComponent({
  methods: {},
})
</script>

<style lang="scss" scoped>
.normal-page__header {
  position: relative;
  z-index: 4;
  display: flex;
  width: 100%;
  gap: 1rem;
  align-items: center;
  padding: var(--gap-md) 0;

  .user-header__text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--gap-xs);
  }

  .user-header__title {
    font-size: 2rem;
    margin: 0;

    .username {
      font-size: 2rem;
      margin: 0;
      display: inline;
    }

    .badge-icon {
      display: inline;
      padding: 0;
      background: none;
      height: 1.5rem;
      width: 1.5rem;
      margin-left: 0.5rem;

      &.creator {
        color: var(--color-blue);
      }

      &.moderator {
        color: var(--color-orange);
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

.mobile-username {
  margin: 0.25rem 0;
}

@media screen and (min-width: 501px) {
  .mobile-username {
    display: none;
  }
}

.sidebar {
  padding-top: 2.5rem;
}

.sidebar__item:not(:last-child) {
  margin: 0 0 0.75rem 0;
}

.profile-picture {
  border-radius: var(--size-rounded-lg);
  height: 8rem;
  width: 8rem;
}

.username {
  font-size: var(--font-size-xl);
}

.bio {
  display: block;
  overflow-wrap: break-word;
}

.secondary-stat {
  align-items: center;
  display: flex;
  margin-bottom: 0.8rem;
}

.secondary-stat__icon {
  height: 1rem;
  width: 1rem;
}

.secondary-stat__text {
  margin-left: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date {
  cursor: default;
}

.inputs {
  margin-bottom: 1rem;

  input {
    margin-top: 0.5rem;
    width: 100%;
  }

  label {
    margin-bottom: 0;
  }
}

.button-group:first-child {
  margin-left: auto;
}

.textarea-wrapper {
  height: 10rem;
}

.badges-container {
  display: flex;
  flex-direction: row;
  gap: var(--gap-lg);

  .badge {
    --_size: 3.5rem;
    border-radius: var(--radius-md);
    overflow: hidden;
    width: var(--_size);
    height: var(--_size);

    svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
