<template>
  <Modal
    ref="modal"
    :header="type === 'organization' ? 'Create an organization' : 'Create a collection'"
  >
    <div class="universal-modal modal-creation universal-labels">
      <div class="markdown-body">
        <p v-if="type === 'organization'">
          New organizations are created with you as the owner and can be found under your profile
          page.
        </p>
        <p v-else>
          Your new collection will be created as a public collection with
          {{ projectIds.length > 0 ? projectIds.length : 'no' }}
          {{ projectIds.length !== 1 ? 'projects' : 'project' }}.
        </p>
      </div>
      <label for="name">
        <span class="label__title">Name<span class="required">*</span></span>
      </label>
      <input
        id="name"
        v-model="name"
        type="text"
        maxlength="64"
        :placeholder="`Enter ${type} name...`"
        autocomplete="off"
      />
      <label for="additional-information">
        <span class="label__title">Summary<span class="required">*</span></span>
        <span class="label__description"
          >This appears in search and on the sidebar of your {{ type }}'s page.</span
        >
      </label>
      <div class="textarea-wrapper">
        <textarea id="additional-information" v-model="description" maxlength="256" />
      </div>
      <div class="push-right input-group">
        <Button @click="cancel">
          <CrossIcon />
          Cancel
        </Button>
        <Button color="primary" @click="createProject">
          <CheckIcon />
          Continue
        </Button>
      </div>
    </div>
  </Modal>
</template>
<script setup>
import { XIcon as CrossIcon, CheckIcon, Modal, Button } from 'omorphia'

const router = useRouter()

const name = ref('')
const description = ref('')

const modal = ref()

const props = defineProps({
  type: {
    type: Object,
    default() {
      return {}
    },
  },
  projectIds: {
    type: Array,
    default() {
      return []
    },
  },
})

function cancel() {
  modal.value.hide()
}

async function createProject() {
  startLoading()
  try {
    const value = {
      title: name.value.trim(),
      description: description.value.trim(),
    }

    if (props.type === 'collection') {
      value.projects = props.projectIds
    }

    const result = await useBaseFetch(props.type, {
      method: 'POST',
      body: JSON.stringify(value),
    })

    modal.value.hide()
    await router.push(
      props.type === 'organization' ? `/organization/${name.value}` : `/collection/${result.id}`
    )
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: err,
      type: 'error',
    })
  }
  stopLoading()
}

function show() {
  name.value = ''
  description.value = ''
  modal.value.show()
}

defineExpose({
  show,
})

watch(
  () => name.value,
  (value) => {
    if (props.disallowSpaces) {
      name.value = value.replace(/ +/g, '')
    }
  }
)
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
