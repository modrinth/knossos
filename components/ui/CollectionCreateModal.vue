<template>
  <Modal ref="modal" :header="formatMessage(messages.header)">
    <div class="universal-modal modal-creation universal-labels">
      <div class="markdown-body">
        <p>
          Your new collection will be created as a public collection with
          {{ projectIds.length > 0 ? projectIds.length : 'no' }}
          {{ projectIds.length !== 1 ? 'projects' : 'project' }}.
        </p>
      </div>
      <label for="name">
        <span class="label__title">{{ formatMessage(messages.nameLabel) }}<span class="required">*</span></span>
      </label>
      <input
        id="name"
        v-model="name"
        type="text"
        maxlength="64"
        :placeholder="formatMessage(messages.namePlaceholder)"
        autocomplete="off"
      />
      <label for="additional-information">
        <span class="label__title">Summary<span class="required">*</span></span>
        <span class="label__description">This appears on your collection's page.</span>
      </label>
      <div class="textarea-wrapper">
        <textarea id="additional-information" v-model="description" maxlength="256" />
      </div>
      <div class="push-right input-group">
        <Button @click="modal.hide()">
          <CrossIcon />
          {{ formatMessage(commonMessages.cancelButton) }}
        </Button>
        <Button color="primary" @click="create">
          <CheckIcon />
          {{ formatMessage(commonMessages.continueButton) }}
        </Button>
      </div>
    </div>
  </Modal>
</template>
<script setup>
import { XIcon as CrossIcon, CheckIcon, Modal, Button } from 'omorphia'

const { formatMessage } = useVIntl()

const messages = defineMessages({
  header: {
    id: 'component.modal.collection-create.header',
    defaultMessage: 'Create a collection',
  },
  nameLabel: {
    id: 'component.modal.collection-create.name.label',
    defaultMessage: 'Name',
  },
  namePlaceholder: {
    id: 'component.modal.collection-create.name.placeholder',
    defaultMessage: 'Enter collection name...',
  },
})

const router = useRouter()

const name = ref('')
const description = ref('')

const modal = ref()

const props = defineProps({
  projectIds: {
    type: Array,
    default() {
      return []
    },
  },
})

async function create() {
  startLoading()
  try {
    const result = await useBaseFetch('collection', {
      method: 'POST',
      body: {
        name: name.value.trim(),
        description: description.value.trim(),
        projects: props.projectIds,
      },
      apiVersion: 3,
    })

    await initUserCollections()

    modal.value.hide()
    await router.push(`/collection/${result.id}`)
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: err?.data?.description || err?.message || err,
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
</script>

<style scoped lang="scss">
.modal-creation {
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
