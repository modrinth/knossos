<template>
  <Modal ref="modal" :header="type === 'organization' ? 'Create an organization' : 'Create a collection'">
    <div class="modal-creation universal-labels">
      <div class="markdown-body">
        <p v-if="type === 'organization'">
          New organizations are created with you as the owner and can be found under your profile page.
        </p>
        <p v-else>
          New collections are created as public as an empty collection.
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
          >This appears in search and on the sidebar of your {{type}}'s page.</span
        >
      </label>
      <div class="textarea-wrapper">
        <textarea id="additional-information" v-model="description" maxlength="256" />
      </div>
      <div class="push-right input-group">
        <button class="iconified-button" @click="cancel">
          <CrossIcon />
          Cancel
        </button>
        <button class="iconified-button brand-button" @click="createProject">
          <CheckIcon />
          Continue
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import CrossIcon from '~/assets/images/utils/x.svg'
import CheckIcon from '~/assets/images/utils/right-arrow.svg'
import Modal from '~/components/ui/Modal.vue'
import Chips from '~/components/ui/Chips.vue'

export default {
  components: {
    Chips,
    CrossIcon,
    CheckIcon,
    Modal,
  },
  props: {
    type: {
      type: String,
      default: 'organization',
    },
    disallowSpaces: {
      type: Boolean,
      default: false,
    },
    project: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      name: '',
      description: '',
    }
  },
  methods: {
    cancel() {
      this.$refs.modal.hide()
    },
    async createProject() {
      startLoading()

      try {
        const result = await useBaseFetch(this.type, {
          method: 'POST',
          body: JSON.stringify({
            title: this.name.trim(),
            description: this.description.trim(),
            projects: this.project ? [this.project] : []
          }),
        })

        console.log(result)

        this.$refs.modal.hide()
        await this.$router.push(this.type === 'organization' ? `/organization/${this.name}` : `/collection/${result.id}`)
      } catch (err) {
        this.$notify({
          group: 'main',
          title: 'An error occurred',
          text: err.data,
          type: 'error',
        })
      }
      stopLoading()
    },
    show() {
      this.name = ''
      this.description = ''
      this.$refs.modal.show()
    },
  },
  watch: {
    name(value) {
      if (this.disallowSpaces) {
        this.name = value.replace(/ +/g, '');
      }
    }
  }
}
</script>

<style scoped lang="scss">
.modal-creation {
  padding: var(--spacing-card-bg);
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
    margin-top: var(--spacing-card-md);
  }
}
</style>
