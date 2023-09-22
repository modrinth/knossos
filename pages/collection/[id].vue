<script setup>
import {Avatar, Button, Card, ShareIcon, BoxIcon} from "omorphia";
import Breadcrumbs from "~/components/ui/Breadcrumbs.vue";
import SettingsIcon from "assets/images/utils/settings.svg";
import NavStackItem from "~/components/ui/NavStackItem.vue";
import NavStack from "~/components/ui/NavStack.vue";

const data = useNuxtApp()
const route = useRoute()

const collection = shallowRef(await useAsyncData(`collection/${route.params.id}`, () => useBaseFetch(`collection/${route.params.id}`)).then(res => res.data))
const projects = shallowRef(await useAsyncData(`projects?ids=[${collection.value.projects.map(p => `"${p}"`).join(',')}]`, () => useBaseFetch(`projects?ids=[${collection.value.projects.map(p => `"${p}"`).join(',')}]`)).then(res => res.data))

const projectTypes = ref(['All']);
projectTypes.value.push(...projects.value.map(p => p.project_type).filter((v, i, a) => a.indexOf(v) === i));
const projectType = ref('All');
const inputText = ref('');

const patchCollection = async (resData, quiet = false) => {
  let result = false
  startLoading()

  try {
    await useBaseFetch(`collection/${collection.value.id}`, {
      method: 'PATCH',
      body: resData,
    })

    await resetCollection();

    result = true
    if (!quiet) {
      data.$notify({
        group: 'main',
        title: 'Collection updated',
        text: 'Your collection has been updated.',
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
        `collection/${collection.value.id}/icon?ext=${
            icon.type.split('/')[icon.type.split('/').length - 1]
        }`,
        {
          method: 'PATCH',
          body: icon,
        }
    )
    await resetCollection()
    result = true
    data.$notify({
      group: 'main',
      title: 'Collection icon updated',
      text: "Your collection's icon has been updated.",
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
  await useBaseFetch(`collection/${collection.value.id}/icon`, {
    method: 'DELETE',
  })
  await resetCollection()
  this.$notify({
    group: 'main',
    title: 'Collection icon removed',
    text: "Your Collections's icon has been removed.",
    type: 'success',
  })
}

const resetCollection = async () => {
  collection.value = await useBaseFetch(`collection/${collection.value.id}`)
  projects.value = await useBaseFetch(`projects?ids=[${collection.value.projects.map(p => `"${p}"`).join(',')}]`)
}
</script>

<template>
<div class="normal-page" :class="{ 'no-sidebar': !$route.name.startsWith('collection-id-settings'), 'left-sidebar': $route.name.startsWith('collection-id-settings')}">
  <div v-if="!$route.name.startsWith('collection-id-settings')" class="normal-page__header">
    <div class="page-header">
      <Avatar size="md" class="page-header__icon" :src="collection.icon_url" />
      <div class="page-header__text">
        <div class="title">
          <h1>{{collection.title}}</h1>
          <Button>
            <ShareIcon />
          </Button>
        </div>
        <div class="markdown-body">
          <p>{{collection.description}}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-if="$route.name.startsWith('collection-id-settings')" class="normal-page__sidebar">
    <div class="sidebar">
      <Breadcrumbs
          current-title="Settings"
          :link-stack="[
            { href: `/dashboard/collections`, label: 'Collections' },
            {
              href: `/collection/${collection.id}`,
              label: collection.title,
              allowTrimming: true,
            },
          ]"
      />
      <div class="settings-header">
        <Avatar
            :src="collection.icon_url"
            :alt="collection.title"
            size="sm"
            class="settings-header__icon"
        />
        <div class="settings-header__text">
          <h1 class="wrap-as-needed">
            {{ collection.title }}
          </h1>
        </div>
      </div>
      <NavStack>
        <NavStackItem
            :link="`/collection/${collection.id}/settings`"
            label="General"
        >
          <SettingsIcon />
        </NavStackItem>
        <NavStackItem
            :link="`/collection/${collection.id}/settings/projects`"
            label="Projects"
        >
          <BoxIcon />
        </NavStackItem>
      </NavStack>
    </div>
  </div>
  <div class="normal-page__content">
    <NuxtPage
      v-model:collection="collection"
      v-model:projects="projects"
      v-model:projectTypes="projectTypes"
      :patchCollection="patchCollection"
      :patchIcon="patchIcon"
      :deleteIcon="deleteIcon"
    />
  </div>
</div>
</template>

<style scoped lang="scss">
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
      margin: 0;
    }
  }
}

.sidebar {
  margin-bottom: var(--gap-md);
}
</style>
