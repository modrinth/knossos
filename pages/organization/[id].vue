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
} from 'omorphia'
import Avatar from '~/components/ui/Avatar.vue'
import YoutubeIcon from 'assets/images/utils/youtube.svg'
import DiscordIcon from 'assets/images/external/discord.svg'
import NavRow from '~/components/ui/NavRow.vue'

const data = useNuxtApp()
const route = useRoute()

const organization = shallowRef(await useAsyncData(`organization/${route.params.id}`, () => useBaseFetch(`organization/${route.params.id}`)).then(res => res.data))
const projects = shallowRef([])

const projectTypes = ref(['All']);
const projectType = ref('All');
const inputText = ref('');
const icon = ref(null)
const deletedIcon = ref(false)
const previewImage = ref(null)
const name = ref(organization.value.title)
const summary = ref(organization.value.description)
const visibility = ref(organization.value.status)
const tags = useTags()
const enableEditing = ref(false);

const patchData = computed(() => {
  const data = {}

  if (name.value !== organization.value.title) {
    data.title = name.value
  }
  if (summary.value !== organization.value.description) {
    data.description = summary.value
  }
  if (hasModifiedVisibility() && tags.value.approvedStatuses.includes(visibility.value)) {
    data.status = visibility.value
  }

  return data
})

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
  projects.value = await useBaseFetch(`projects?ids=[${organization.value.projects.map(p => `"${p}"`).join(',')}]`)
}

const hasPermission = computed(() => {
  const EDIT_DETAILS = 1 << 2
  return true;
})

const hasChanges = computed(() => {
  return Object.keys(patchData.value).length > 0 || deletedIcon.value || icon.value || hasModifiedVisibility()
})

const hasModifiedVisibility = () => {
  const originalVisibility = tags.value.approvedStatuses.includes(organization.value.status)
      ? organization.value.status
      : 'listed'

  return originalVisibility !== visibility.value
}

const saveChanges = async () => {
  if (hasChanges.value) {
    await patchOrganization(patchData.value)
  }

  if (deletedIcon.value) {
    await deleteIcon()
    deletedIcon.value = false
  } else if (icon.value) {
    await patchIcon(icon.value)
    icon.value = null
  }
}

const markIconForDeletion = () => {
  deletedIcon.value = true
  icon.value = null
  previewImage.value = null
}

const showPreviewImage = (files) => {
  const reader = new FileReader()
  icon.value = files[0]
  deletedIcon.value = false
  reader.readAsDataURL(icon.value)
  reader.onload = (event) => {
    previewImage.value = event.target.result
  }
}
</script>

<template>
  <div class="normal-page no-sidebar organization">
    <div class="normal-page__header">
      <div class="page-header">
        <Avatar
          class="page-header__icon"
          :src="organization.icon_url"
          size="md"
          circle
        />
        <div class="page-header__text">
          <div class="title">
            <h1>{{organization.title}}</h1>
            <Button icon-only> <ShareIcon /> </Button>
          </div>
          <div class="links">
            <div class="link-like">
              <DownloadIcon />
              <span>{{projects}} Downloads</span>
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
              href: `/organization/${organization.id}/`,
            },
            {
              label: 'Projects',
              href: `/organization/${organization.id}/projects`,
            },
            {
              label: 'Collections',
              href: `/organization/${organization.id}/collections`,
            },
            {
              label: 'Members',
              href: `/organization/${organization.id}/members`,
            },
          ]"
        />
        <Button>
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
</style>
