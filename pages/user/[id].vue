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
    <Modal
        ref="editModal"
        header="Edit profile"
    >
      <div class="modal-body">
        <div class="edit-section">
          <div class="avatar-section">
            <Avatar size="lg" :src="previewImage ?? user.avatar_url" circle/>
            <PopoutMenu class="btn icon-edit-button icon-only" position="bottom" direction="right">
              <EditIcon />
              <template #menu>
            <span class="icon-edit-menu">
              <FileInput
                  id="project-icon"
                  :max-size="262144"
                  :show-icon="true"
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  class="btn btn-transparent upload"
                  style="white-space: nowrap"
                  prompt=""
                  @change="showPreviewImage"
              >
                <UploadIcon />
                Upload icon
              </FileInput>
            </span>
              </template>
            </PopoutMenu>
          </div>
          <input
              type="text"
              placeholder="Username"
              v-model="username"
          />
          <textarea
              placeholder="About me"
              v-model="bio"
          />
        </div>
        <div class="input-group push-right">
          <Button @click="$refs.editModal.hide()">
            <XIcon/>
            Cancel
          </Button>
          <Button
              color="primary"
              :disabled="!hasChanges"
              @click="saveChanges()"
          >
            <SaveIcon />
            Save changes
          </Button>
        </div>
      </div>
    </Modal>
    <div class="normal-page">
      <div class="user-header">
        <div class="banner-img">
          <div class="banner-content">
            <Avatar
                :src="previewImage ?? user.avatar_url"
                size="lg"
                circle
                :alt="user.username"
            />
            <div class="user-text">
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
            </div>
          </div>
        </div>
        <PageBar>
          <span class="page-bar__title"><FilterIcon /> Filter by</span>
          <a class="nav-button" :class="{'router-link-exact-active': selectedFilter === 'all'}" @click="() => selectedFilter = 'all'">All</a>
          <template v-for="(filter, index) in filterOptions" :key="filter">
            <div class="nav-button" v-if="filter === selectedFilter || index < 2" :class="{'router-link-exact-active': selectedFilter === filter}" @click="() => selectedFilter = filter">
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
              class="link btn transparent nav-button"
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
          <template #right>
            <div
                v-if="auth.user && (auth.user.id === user.id || tags.staffRoles.includes(auth.user.role))"
                class="nav-button button-base"
                @click="showEditModal"
            >
              <EditIcon />
              Edit profile
            </div>
            <div
                v-if="auth.user && auth.user.id !== user.id"
                class="nav-button button-base"
                @click="() => $refs.modal_report.show()"
            >
              <TrashIcon />
              Report
            </div>
          </template>
        </PageBar>
      </div>
      <div class="normal-page__sidebar">
        <div class="universal-card about-card">
          <h2 class="sidebar-card-header">About</h2>
          <div class="sidebar__item">
            <div class="secondary-stat">
              <DownloadIcon class="secondary-stat__icon" />
              <span class="secondary-stat__text">
                <span class="secondary-stat__value">{{ sumDownloads }}</span>
                <span>downloads</span>
              </span>
            </div>
            <div class="secondary-stat">
              <FlameIcon class="secondary-stat__icon" />
              <span class="secondary-stat__text">
                <span class="secondary-stat__value">{{ sumFollows }}</span>
                <span>followers of projects</span>
              </span>
            </div>
            <div class="secondary-stat">
              <BoxIcon class="secondary-stat__icon" />
              <span class="secondary-stat__text">
                <span class="secondary-stat__value" >{{ projects.length }}</span>
                <span>Projects</span>
              </span>
            </div>
            <div class="secondary-stat">
              <SunriseIcon class="secondary-stat__icon" />
              <span class="secondary-stat__text">
                <span>Joined</span>
                <span class="secondary-stat__value">{{ dayjs(user.created).fromNow() }}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="card">
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
        <div v-if="organizations" class="card">
          <h2 class="sidebar-card-header">Organizations</h2>
          <div class="organizations">
            <router-link v-for="org in organizations" class="button-base clickable" :to="'/organization/' + org.title">
              <Avatar
                  :key="org.id"
                  :src="org.icon_url"
                  :alt="org.title"
                  size="sm"
                  @click="$router.push('/organization/' + org.title)"
              />
            </router-link>
          </div>
        </div>
      </div>
      <div class="normal-page__content">
        <Promotion />
        <div class="search-row">
          <div class="iconified-input">
            <SearchIcon />
            <input id="search-input" v-model="inputText" type="text" placeholder="Search for mods..." />
            <Button class="r-btn" :class="inputText ? '' : 'empty'" @click="() => (inputText = '')">
              <XIcon />
            </Button>
          </div>
        </div>
        <div
          v-if="projects.length > 0"
          class="project-list"
          :class="
            'display-mode--' +
            (['list', 'grid'].includes(cosmetics.searchDisplayMode.user)
              ? cosmetics.searchDisplayMode.user
              : 'list')
          "
        >
          <ProjectCard
            v-for="project in projects.filter(
                  (x) =>
                    x.project_type === selectedFilter || selectedFilter === 'all'
              )
              .filter((x) => x.title.toLowerCase().includes(inputText.toLowerCase()))
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
            :from-now="fromNow"
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
  OverflowMenu,
  Button,
  SearchIcon,
  SaveIcon,
  PopoutMenu,
  EditIcon,
  TrashIcon,
  UploadIcon,
  FileInput,
  XIcon,
  ServerIcon,
  MoreHorizontalIcon,
  DownloadIcon,
  SunriseIcon,
  ProjectCard,
  Avatar,
  NavRow,
  SettingsIcon,
  GridIcon,
  ListIcon,
  ImageIcon,
  formatNumber,
} from 'omorphia'
import UpToDate from '~/assets/images/illustrations/up_to_date.svg'
import ModalCreation from '~/components/ui/ModalCreation.vue'

import Badge1MDownloads from '~/assets/images/badges/downloads-1m.svg'
import Badge100kDownloads from '~/assets/images/badges/downloads-100k.svg'
import BadgeModrinthTeam from '~/assets/images/badges/modrinth-team.svg'
import FilterIcon from "assets/images/utils/filter.svg";
import WorldIcon from "assets/images/utils/world.svg";
import GlassesIcon from "assets/images/utils/glasses.svg";
import PackageIcon from "assets/images/utils/package-open.svg";
import BracesIcon from "assets/images/utils/braces.svg";
import FlameIcon from "assets/images/utils/flame.svg";
import PageBar from "~/components/ui/PageBar.vue";

import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const data = useNuxtApp()
const route = useRoute()
const auth = await useAuth()
const cosmetics = useCosmetics()
const tags = useTags()

const inputText = ref('')
const selectedFilter = ref('all')
const editModal = ref(null)

const messages = defineMessages({
  profileManageProjectsButton: {
    id: 'profile.button.manage-projects',
    defaultMessage: 'Manage projects',
  },
  profileMetaDescription: {
    id: 'profile.meta.description',
    defaultMessage: "Download {username}'s projects on Modrinth",
  },
  profileMetaDescriptionWithBio: {
    id: 'profile.meta.description-with-bio',
    defaultMessage: "{bio} - Download {username}'s projects on Modrinth",
  },
  profileNoProjectsLabel: {
    id: 'profile.label.no-projects',
    defaultMessage: 'This user has no projects!',
  },
  profileNoProjectsAuthLabel: {
    id: 'profile.label.no-projects-auth',
    defaultMessage:
      "You don't have any projects.\nWould you like to <create-link>create one</create-link>?",
  },
  userNotFoundError: {
    id: 'profile.error.not-found',
    defaultMessage: 'User not found',
  },
})

let user, projects, collections, organizations

try {
  ;[{ data: user }, { data: projects }, { data: collections}, {data: organizations}] = await Promise.all([
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
    useAsyncData(`user/${route.params.id}/collections`, () => useBaseFetch(`user/${route.params.id}/collections`)),
    useAsyncData(`user/${route.params.id}/organizations`, () => useBaseFetch(`user/${route.params.id}/organizations`)),
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

const filterOptions = ref([])
filterOptions.value.push(...projectTypes.value)

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
const username = ref(user.value.username)
const bio = ref(user.value.bio)
const previewImage = shallowRef(null)

function showPreviewImage(files) {
  const reader = new FileReader()
  icon.value = files[0]
  reader.readAsDataURL(icon.value)
  reader.onload = (event) => {
    previewImage.value = event.target.result
  }
}

const showEditModal = () => {
  editModal.value.show()
  username.value = user.value.username
  bio.value = user.value.bio
}

const hasChanges = computed(() => {
  return (
    (icon.value && icon.value !== user.value.avatar_url) ||
    username.value !== user.value.username ||
    bio.value !== user.value.bio
  )
})

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
      bio: bio.value,
    }

    if (username.value !== auth.value.user.username) {
      reqData.username = username.value
    }

    await useBaseFetch(`user/${auth.value.user.id}`, {
      method: 'PATCH',
      body: reqData,
    })

    user.value.username = username.value
    user.value.bio = bio.value

    await useAuth(auth.value.token)

    editModal.value.hide()

    data.$notify({
      group: 'main',
      title: 'Profile updated',
      text: 'Your profile has been updated',
      type: 'success',
    })
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
}

.secondary-stat__icon {
  height: 1rem;
  width: 1rem;
}

.secondary-stat__text {
  margin-left: 0.4rem;
  display: flex;
  align-items: center;
  gap: var(--gap-xs);
}

.secondary-stat__value {
  font-weight: bolder;
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

.textarea-wrapper {
  height: 10rem;
}

.badges-container {
  display: flex;
  flex-direction: row;
  gap: var(--gap-sm);

  .badge {
    --_size: 3.5rem;
    border-radius: 100%;
    overflow: hidden;
    width: var(--_size);
    height: var(--_size);

    svg {
      width: 100%;
      height: 100%;
    }
  }
}

.team-member {
  align-items: center;
  padding: 0.25rem 0.5rem;
  margin-left: -.25rem;

  .member-info {
    overflow: hidden;
    margin: auto 0 auto 0.75rem;

    .name {
      font-weight: bold;
    }

    p {
      font-size: var(--font-size-sm);
      margin: 0.2rem 0;
    }
  }
}

.user-header {
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

      .avatar {
        border: 6px var(--color-bg) solid;
        box-shadow: none;
      }

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

.user-header {
  grid-area: header;
}

.organizations {
  display: flex;
  flex-direction: row;
  gap: var(--gap-sm);
  flex-wrap: wrap;
}

.about-card {
  h2 {
    margin-bottom: var(--gap-md);
  }

  .sidebar__item {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
  }
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
  padding: var(--gap-lg);
}

.edit-section {
  display: grid;
  grid-template:
    'icon name' 40px
    'icon description' auto
    / auto 1fr;
  grid-gap: var(--gap-sm);
  column-gap: var(--gap-md);

  .avatar-section {
    position: relative;
    grid-area: icon;
    width: 9rem;
    height: 9rem;

    .avatar {
      background-color: var(--color-bg);
      border: 1px solid var(--color-button-bg);
    }

    .popup-container {
      position: absolute;
      top: var(--gap-sm);
      right: var(--gap-sm);
    }
  }

  input {
    grid-area: name;
  }

  textarea {
    grid-area: description;
  }
}
</style>
