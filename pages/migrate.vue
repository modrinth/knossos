<template>
  <div>
    <div class="normal-page">
      <div>
        <section>
          <Card>
            <h1>Migrate</h1>
            <p>
              This page is for migrating projects from Flame Anvil to Modrinth. It is currently a
              work in progress. Plug in your Flame Anvil username and click search to get started.
            </p>
            <Button>Get Started</Button>
          </Card>
        </section>

        <section>
          <Card>
            <h2>Search</h2>
            <div class="input-row">
              <input v-model="username" type="text" placeholder="username" />
              <Button @click="searchHandler">
                <SearchIcon />
                Search
              </Button>
            </div>
          </Card>
        </section>

        <section>
          <Card>
            <h2>Authorize</h2>
            <p>
              Go to
              <a href="https://authors-old.curseforge.com/account/api-tokens">
                https://authors-old.curseforge.com/account/api-tokens
              </a>
              and create a new token to confirm your identity. TODO: Authentication, validation
            </p>
            <div class="input-row">
              <input v-model="faToken" type="text" placeholder="TODO: uuid display" />
              <Button @click="searchHandler">
                <CheckIcon />
                Confirm
              </Button>
            </div>
          </Card>
        </section>

        <section v-if="modList?.length > 0">
          <Card>
            <h2>Which project would you like to migrate?</h2>

            <div class="project-grid">
              <button
                v-for="project in modList"
                :key="project.id"
                :class="`btn project-card ${
                  selectedProject?.id === project.id ? 'project-card__selected' : ''
                }`"
                @click="
                  () => {
                    selectedProject = project
                  }
                "
              >
                <div class="project-card__title">
                  <Avatar :src="project.logo.url" size="sm" />
                  <div class="project-card__title__text">
                    <div class="project-card__title__text__name">
                      {{ project.name }}
                    </div>
                    <div>
                      {{ formatProjectType(flameAnvilClassIDToType(project.classId) || 'unknown') }}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </Card>
        </section>

        <section v-if="selectedProject">
          <Card>
            <h2>Migrate {{ selectedProject.name }}</h2>

            <p>
              Modrinth needs to know some information that other platforms may not have available.
              If you don't know the answer to a question, you can choose to defer and fill it in at
              a later time.
            </p>

            <h3>License</h3>
            <p>
              Please select which license this project is under. If you are unsure, you can skip
              this step and fill it in later.
            </p>

            <div>
              <pre><code>{{ JSON.stringify(selectedProjectLicense, null, 2) }}</code></pre>
            </div>

            <h3>Environment</h3>

            <p>Modrinth projects can be client-side, server-side, or both.</p>
            <p>
              Please select which environment(s) this project is for. If you are unsure, you can
              skip this step and fill it in later.
            </p>

            <div class="universal-labels">
              <label for="client-chips"> <span class="label__title"> Client </span> </label>
              <Chips
                v-model="selectedProjectClientEnv"
                :items="['required', 'optional', 'unsupported']"
              />

              <label for="client-chips"> <span class="label__title"> Server </span> </label>
              <Chips
                v-model="selectedProjectServerEnv"
                :items="['required', 'optional', 'unsupported']"
              />
            </div>

            <Button @click="startMigration"> Migrate {{ selectedProject.name }} </Button>
          </Card>
        </section>

        <section>
          <Card>
            <h2>Progress</h2>

            <p>
              This is the progress of the migration. It will show you how many versions and
              screenshots have been migrated.
            </p>

            <div>
              {{ migrationInProgress ? 'Migration in progress' : 'Migration not in progress' }}
            </div>

            <div>
              Versions: {{ migrationVersionIndexProgress }} / {{ migrationVersionIndexTotal }}
            </div>
            <div>Screenshots: {{ migrateScreenshotProgress }} / {{ migrationScreenshotTotal }}</div>
          </Card>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatProjectType, Avatar, Button, Card, Chips, SearchIcon, CheckIcon } from 'omorphia'
import { ref } from 'vue'
import { valid as semverValid } from 'semver'

import {
  useFlameAnvilModsByUser,
  useFlameAnvilModsByID,
  useFlameAnvilVersionsFromMod,
} from '~/composables/flame-utils.ts'
import type { FAMod } from '~/types/flame-anvil.ts'
import { inferVersionInfo } from '~/helpers/infer'

const username = ref<string>('')
const faToken = ref<string>('')
const userID = ref<number | null>(null)

const modList = ref<FAMod[]>([])

const selectedProject = ref<FAMod | null>(null)
const selectedProjectLicense = ref<{ id: string; url?: string }>({
  id: 'LicenseRef-Unknown',
})
const selectedProjectClientEnv = ref<string>('required')
const selectedProjectServerEnv = ref<string>('required')

const searchHandler = async () => {
  const searchResults = await useFlameAnvilModsByUser(username.value)

  const authorIDs = searchResults.data.reduce((a: Map<string, number>, mod) => {
    mod.authors.forEach((author: { name: string; id: number }) => {
      a.set(author.name.toLowerCase(), author.id)
    })
    return a
  }, new Map<string, number>())

  const uid = authorIDs.get(username.value.toLowerCase())

  if (!uid) {
    throw new Error(`Failed to find user ID for ${username.value}`)
  }

  const mods = await useFlameAnvilModsByID(uid)

  userID.value = uid
  modList.value = mods.data
    .filter((m) => [5, 6, 12, 6552].includes(m.classId ?? -1))
    .sort((a, b) => b.downloadCount - a.downloadCount)
}

const migrationInProgress = ref(false)

const startMigration = async () => {
  try {
    migrationInProgress.value = true
    await migrationHandler()
  } catch (error) {
    console.error(error)
  }

  migrationInProgress.value = false
}

const migrationHandler = async () => {
  if (!selectedProject.value) {
    throw new Error('No project selected')
  }
  if (!selectedProjectLicense.value) {
    throw new Error('No license selected')
  }

  const project = selectedProject.value

  const description = await useFlameAnvilModDescription(project.id)

  const formData = new FormData()

  const type = flameAnvilClassIDToType(project.classId)

  if (!type) {
    throw new Error('Unknown project type')
  }

  const { categories, additional: additionalCategories } = flameAnvilTypeTagConversion(
    type,
    project.categories
  )

  // DATA
  let data: any = {
    title: project.name,
    project_type: type,
    slug: project.slug,
    description: project.summary,
    body: description,

    initial_versions: [],

    categories,
    additional_categories: additionalCategories,

    client_side: selectedProjectClientEnv.value,
    server_side: selectedProjectServerEnv.value,

    license_id: selectedProjectLicense.value.id,

    is_draft: true,
  }

  if (project.links?.issuesUrl?.length > 0) {
    data = {
      ...data,
      issues_url: project.links.issuesUrl,
    }
  }
  if (project.links?.sourceUrl?.length > 0) {
    data = {
      ...data,
      source_url: project.links.sourceUrl,
    }
  }
  if (project.links?.wikiUrl?.length > 0) {
    data = {
      ...data,
      wiki_url: project.links.wikiUrl,
    }
  }

  formData.append('data', JSON.stringify(data))
  // END DATA

  // ICON
  const iconURLByProxy = new URL('https://wsrv.nl/')
  iconURLByProxy.searchParams.set('url', project.logo.url)

  const logoRes = await fetch(iconURLByProxy)
  const logoBlob = await logoRes.blob()

  formData.append('icon', logoBlob, 'logo.png')
  // END ICON

  const mrProject = (await useBaseFetch('project', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Disposition': formData,
    },
  })) as { title: string; id: string }

  if (!mrProject || !mrProject.id || !mrProject.title) {
    throw new Error('Failed to create project')
  }

  // TODO: This should be optional
  await migrationHandleVersionFiles(mrProject)

  // TODO: This should be optional
  await migrationHandleScreenshotFiles(mrProject)
}

const migrateScreenshotProgress = ref(0)
const migrationScreenshotTotal = ref(0)

const migrationHandleScreenshotFiles = async (mrProject: { title: string; id: string }) => {
  const project = selectedProject.value
  if (!project) {
    throw new Error('No project selected')
  }
  if (!project.screenshots) {
    return
  }

  migrationScreenshotTotal.value = project.screenshots.length

  for (const screenshot of project.screenshots) {
    const screenshotURLByProxy = new URL('https://wsrv.nl/')
    screenshotURLByProxy.searchParams.set('url', screenshot.url)

    const screenshotRes = await fetch(screenshotURLByProxy)
    const screenshotBlob = await screenshotRes.blob()

    const type = screenshotBlob.type.split('/')[1]

    let q: Record<string, string> = {
      ext: type,
      ordering: migrateScreenshotProgress.value.toString(),
      featured: migrateScreenshotProgress.value === 0 ? 'true' : 'false',
    }
    if (screenshot.title) {
      q = {
        ...q,
        title: screenshot.title,
      }
    }
    if (screenshot.description) {
      q = {
        ...q,
        description: screenshot.description,
      }
    }
    const queryParams = new URLSearchParams(q)

    const path = 'project/' + mrProject.id + '/gallery?' + queryParams.toString()

    await useBaseFetch(path, {
      method: 'POST',
      body: screenshotBlob,
      headers: {
        'Content-Disposition': screenshotBlob,
      },
    })

    // Hold 200 ms to prevent rate limiting
    await new Promise((resolve) => setTimeout(resolve, 200))

    migrateScreenshotProgress.value = migrateScreenshotProgress.value + 1
  }
}

const migrationVersionIndexProgress = ref(0)
const migrationVersionIndexTotal = ref(0)

const migrationHandleVersionFiles = async (mrProject: { title: string; id: string }) => {
  const project = selectedProject.value
  if (!project) {
    throw new Error('No project selected')
  }
  const projectType = flameAnvilClassIDToType(project.classId)
  if (!projectType) {
    throw new Error('Unknown project type')
  }

  const firstPage = await useFlameAnvilVersionsFromMod(
    project.id,
    migrationVersionIndexProgress.value
  )

  const fileQueue = firstPage.data

  migrationVersionIndexTotal.value = firstPage.pagination.totalCount

  // We can only get 50 versions at a time, so we need to paginate
  for (let i = 49; i < migrationVersionIndexTotal.value; i += 50) {
    const nextPage = await useFlameAnvilVersionsFromMod(project.id, i)
    fileQueue.push(...nextPage.data)
  }

  for (const version of fileQueue.reverse()) {
    const versionFileResponse = await fetch(
      'https://cors-clean.modrinth.workers.dev/?url=' + encodeURIComponent(version.downloadUrl)
    )
    const versionFileBlob = await versionFileResponse.blob()
    const versionFile = new File([versionFileBlob], version.fileName, {
      lastModified: new Date(version.fileDate).getTime(),
      type: versionFileBlob.type,
    })

    const formData = new FormData()

    // DATA
    const gameVersions = version.gameVersions.filter((v) => semverValid(v))

    let serializedVersionFile: Record<string, unknown> = {}

    try {
      serializedVersionFile = await inferVersionInfo(
        versionFile,
        {
          title: mrProject.title,
          actualProjectType: projectType,
        },
        gameVersions
      )
    } catch (error) {
      console.error("Couldn't infer version info. Some fields may be missing.", error)
    }

    const primaryFileName = version.fileName

    const data = {
      project_id: mrProject.id,
      file_parts: [primaryFileName],
      primary_file: primaryFileName,
      version_number:
        serializedVersionFile?.version_number ||
        (migrationVersionIndexTotal.value - migrationVersionIndexProgress.value - 1).toString(),
      version_title: version.displayName,
      version_body: '',
      dependencies: [], // TODO: version.dependencies,
      game_versions: [...gameVersions],
      loaders: serializedVersionFile?.loaders || [], // TODO: Prompt user if can't find loaders
      release_channel: serializedVersionFile?.version_type || 'release',
      featured: false,
      uploaded_images: [],
    }

    formData.append('data', JSON.stringify(data))
    // END DATA

    // FILE
    formData.append(primaryFileName, versionFileBlob, primaryFileName)
    // END FILE

    const mrVersion = await useBaseFetch('version', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Disposition': formData,
      },
    })

    console.log(mrVersion)

    migrationVersionIndexProgress.value = migrationVersionIndexProgress.value + 1
    // Hold 200 ms to prevent rate limiting
    await new Promise((resolve) => setTimeout(resolve, 200))
  }

  console.log(fileQueue)
}
</script>

<style lang="scss" scoped>
.input-row {
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: var(--gap-sm);

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--gap-md);
  }
}

.project-card {
  display: flex;
  flex-direction: column;
  text-align: start;
  width: 100%;
  padding: var(--gap-sm);

  border: 1px solid var(--color-divider);

  &:hover {
    background-color: var(--color-button-bg);
  }

  .project-card__body {
    width: 100%;
    display: block;
  }

  .project-card__title {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--gap-sm);

    .project-card__title__text {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
    }

    .project-card__title__text__name {
      font-weight: var(--font-weight-bold);
    }
  }
}

.project-card__selected {
  color: var(--color-contrast);
  background-color: var(--color-brand-highlight);
  box-shadow: inset 0 0 0 transparent, 0 0 0 2px var(--color-brand);

  &:hover {
    background-color: var(--color-brand-highlight);
  }
}
</style>
