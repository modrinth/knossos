<template>
  <Modal ref="modal" header="Create a project" :noblur="!(cosmetics.advancedRendering ?? true)">
    <div class="modal-creation universal-labels">
      <div class="markdown-body">
        <p>New projects are created as drafts and can be found under {{ organization ? organization.title : 'your profile page'}}.</p>
      </div>
      <label for="project-type">
        <span class="label__title">Project type<span class="required">*</span></span>
      </label>
      <Chips
        id="project-type"
        v-model="projectType"
        :items="tags.projectTypes.map((x) => x.display)"
      />
      <label for="name">
        <span class="label__title">Name<span class="required">*</span></span>
      </label>
      <input
        id="name"
        v-model="name"
        type="text"
        maxlength="64"
        placeholder="Enter project name..."
        autocomplete="off"
        @input="updatedName()"
      />
      <label for="slug">
        <span class="label__title">URL<span class="required">*</span></span>
      </label>
      <div class="text-input-wrapper">
        <div class="text-input-wrapper__before">
          https://modrinth.com/{{ actualProjectType ? actualProjectType.id : '???' }}/
        </div>
        <input
          id="slug"
          v-model="slug"
          type="text"
          maxlength="64"
          autocomplete="off"
          @input="manualSlug = true"
        />
      </div>
      <label for="additional-information">
        <span class="label__title">Summary<span class="required">*</span></span>
        <span class="label__description"
          >This appears in search and on the sidebar of your project's page.</span
        >
      </label>
      <div class="textarea-wrapper">
        <textarea id="additional-information" v-model="description" maxlength="256" />
      </div>
      <div class="push-right input-group">
        <button class="btn" @click="cancel">
          <XIcon />
          Cancel
        </button>
        <button class="btn btn-primary" @click="createProject">
          <CheckIcon />
          Continue
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { XIcon, CheckIcon, Modal, Chips } from 'omorphia'

const props = defineProps({
  organization: {
    type: Object,
    default: null,
  },
})

const cosmetics = useCosmetics()
const tags = useTags()
const router = useRouter()

const projectType = ref(tags.value.projectTypes[0].display)
const actualProjectType = computed(() =>
  tags.value.projectTypes.find((x) => projectType.value === x.display)
)

const name = ref('')
const slug = ref('')
const description = ref('')
const manualSlug = ref('')

const modal = ref()

function cancel() {
  modal.value.hide()
}

const clientSide = computed(() => {
  switch (actualProjectType.value.id) {
    case 'plugin':
      return 'unsupported'
    case 'resourcepack':
      return 'required'
    case 'shader':
      return 'required'
    case 'datapack':
      return 'optional'
    default:
      return 'unknown'
  }
})

const serverSide = computed(() => {
  switch (actualProjectType.value.id) {
    case 'plugin':
      return 'required'
    case 'resourcepack':
      return 'unsupported'
    case 'shader':
      return 'unsupported'
    case 'datapack':
      return 'required'
    default:
      return 'unknown'
  }
})

async function createProject() {
  startLoading()

  const projectType = actualProjectType.value

  const formData = new FormData()

  const auth = await useAuth()

  const formValue = {
    title: name.value.trim(),
    project_type: projectType.actual,
    slug: slug.value,
    description: description.value.trim(),
    body: '',
    initial_versions: [],
    team_members: [
      {
        user_id: auth.value.user.id,
        name: auth.value.user.username,
        role: 'Owner',
      },
    ],
    categories: [],
    client_side: clientSide.value,
    server_side: serverSide.value,
    license_id: 'LicenseRef-Unknown',
    is_draft: true,
  };

  if (props.organization) {
    formValue.organization_id = props.organization.id
  }

  formData.append(
    'data',
    JSON.stringify(formValue)
  )

  try {
    await useBaseFetch('project', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Disposition': formData,
      },
    })

    modal.value.hide()
    await router.push({
      name: 'type-id',
      params: {
        type: projectType.id,
        id: slug.value,
      },
      state: {
        overrideProjectType: projectType.id,
      },
    })
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: err.data.description,
      type: 'error',
    })
  }
  stopLoading()
}

function show() {
  projectType.value = tags.value.projectTypes[0].display
  name.value = ''
  slug.value = ''
  description.value = ''
  manualSlug.value = false
  modal.value.show()
}

defineExpose({
  show,
})

function updatedName() {
  if (!manualSlug.value) {
    slug.value = name.value
      .trim()
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll(/[^a-zA-Z0-9!@$()`.+,_"-]/g, '')
      .replaceAll(/--+/gm, '-')
  }
}
</script>

<style scoped lang="scss">
.modal-creation {
  padding: var(--gap-lg);
  display: flex;
  flex-direction: column;

  .markdown-body {
    margin-bottom: 0.5rem;
  }

  input {
    width: 20rem;
    max-width: 100%;
  }

  .text-input-wrapper {
    width: 100%;
  }

  textarea {
    min-height: 5rem;
  }

  .input-group {
    margin-top: var(--gap-md);
  }
}
</style>
