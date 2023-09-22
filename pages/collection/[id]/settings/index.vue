<script setup>
import { Card } from 'omorphia'
import UploadIcon from "assets/images/utils/upload.svg";
import Avatar from "~/components/ui/Avatar.vue";
import FileInput from "~/components/ui/FileInput.vue";
import CheckIcon from "assets/images/utils/check.svg";
import {Multiselect} from "vue-multiselect";
import IssuesIcon from "assets/images/utils/issues.svg";
import ExitIcon from "assets/images/utils/x.svg";
import SaveIcon from "assets/images/utils/save.svg";
import TrashIcon from "assets/images/utils/trash.svg";

const props = defineProps({
  collection: {
    type: Object,
    default() {
      return {}
    },
  },
  patchCollection: {
    type: Function,
    default() {
      return () => {}
    },
  },
  patchIcon: {
    type: Function,
    default() {
      return () => {}
    },
  },
  deleteIcon: {
    type: Function,
    default() {
      return () => {}
    },
  }
})

const hasPermission = computed(() => {
  const EDIT_DETAILS = 1 << 2
  return true;
})

const icon = ref(null)
const deletedIcon = ref(false)
const previewImage = ref(null)
const name = ref(props.collection.title)
const summary = ref(props.collection.description)
const visibility = ref(props.collection.status)
const tags = useTags()

const showPreviewImage = (files) => {
  const reader = new FileReader()
  icon.value = files[0]
  deletedIcon.value = false
  reader.readAsDataURL(icon.value)
  reader.onload = (event) => {
    previewImage.value = event.target.result
  }
}

const patchData = computed(() => {
  const data = {}

  if (name.value !== props.collection.title) {
    data.title = name.value
  }
  if (summary.value !== props.collection.description) {
    data.description = summary.value
  }
  if (hasModifiedVisibility() && tags.value.approvedStatuses.includes(visibility.value)) {
    data.status = visibility.value
  }

  return data
})

const hasChanges = computed(() => {
  return Object.keys(patchData.value).length > 0 || deletedIcon.value || icon.value || hasModifiedVisibility()
})

const hasModifiedVisibility = () => {
  const originalVisibility = tags.value.approvedStatuses.includes(props.collection.status)
      ? props.collection.status
      : 'listed'

  return originalVisibility !== visibility.value
}

const saveChanges = async () => {
  if (hasChanges.value) {
    await props.patchCollection(patchData.value)
  }

  if (deletedIcon.value) {
    await props.deleteIcon()
    deletedIcon.value = false
  } else if (icon.value) {
    await props.patchIcon(icon.value)
    icon.value = null
  }
}

const markIconForDeletion = () => {
  deletedIcon.value = true
  icon.value = null
  previewImage.value = null
}
</script>

<template>
  <Card>
    <div class="label">
      <h3>
        <span class="label__title size-card-header">Project information</span>
      </h3>
    </div>
    <label for="project-icon">
      <span class="label__title">Icon</span>
    </label>
    <div class="input-group">
      <Avatar
          :src="deletedIcon ? null : previewImage ? previewImage : collection.icon_url"
          :alt="collection.title"
          size="md"
          class="project__icon"
      />
      <div class="input-stack">
        <FileInput
            id="project-icon"
            :max-size="262144"
            :show-icon="true"
            accept="image/png,image/jpeg,image/gif,image/webp"
            class="choose-image iconified-button"
            prompt="Upload icon"
            :disabled="!hasPermission"
            @change="showPreviewImage"
        >
          <UploadIcon />
        </FileInput>
        <button
            v-if="!deletedIcon && (previewImage || collection.icon_url)"
            class="iconified-button"
            :disabled="!hasPermission"
            @click="markIconForDeletion"
        >
          <TrashIcon />
          Remove icon
        </button>
      </div>
    </div>

    <label for="project-name">
      <span class="label__title">Name</span>
    </label>
    <input
        id="project-name"
        v-model="name"
        maxlength="2048"
        type="text"
        :disabled="!hasPermission"
    />

    <label for="project-summary">
      <span class="label__title">Summary</span>
    </label>
    <div class="textarea-wrapper summary-input">
        <textarea
            id="project-summary"
            v-model="summary"
            maxlength="256"
            :disabled="!hasPermission"
        />
    </div>
    <div class="adjacent-input">
      <label for="project-visibility">
        <span class="label__title">Visibility</span>
        <div class="label__description">
          Public collections will be visible on your profile and via link. Private collections will only be able to be viewed by you.
          Unlisted collections will be visible via link, but not on your profile.

          <p>If approved by the moderators:</p>
          <ul class="visibility-info">
            <li>
              <ExitIcon
                  v-if="visibility === 'unlisted' || visibility === 'private'"
                  class="bad"
              />
              <CheckIcon v-else class="good" />
              {{ hasModifiedVisibility() ? 'Will be v' : 'V' }}isible on profile
            </li>
            <li>
              <CheckIcon v-if="visibility !== 'private'" class="good" />
              <IssuesIcon
                  v-else
                  v-tooltip="{
                    content:
                      visibility === 'private'
                        ? 'Only members will be able to view the project.'
                        : '',
                  }"
                  class="warn"
              />
              {{ hasModifiedVisibility() ? 'Will be v' : 'V' }}isible via URL
            </li>
          </ul>
        </div>
      </label>
      <Multiselect
          id="project-visibility"
          v-model="visibility"
          placeholder="Select one"
          :options="tags.approvedStatuses"
          :custom-label="(value) => $formatProjectStatus(value)"
          :searchable="false"
          :close-on-select="true"
          :show-labels="false"
          :allow-empty="false"
          :disabled="!hasPermission"
      />
    </div>
    <div class="button-group">
      <button
          type="button"
          class="iconified-button brand-button"
          :disabled="!hasChanges"
          @click="saveChanges()"
      >
        <SaveIcon />
        Save changes
      </button>
    </div>
  </Card>

  <Card>
    <div class="label">
      <h3>
        <span class="label__title size-card-header">Delete project</span>
      </h3>
    </div>
    <p>
      Removes your project from Modrinth's servers and search. Clicking on this will delete your
      project, so be extra careful!
    </p>
    <button
        type="button"
        class="iconified-button danger-button"
        @click="$refs.modal_confirm.show()"
    >
      <TrashIcon />
      Delete project
    </button>
  </Card>
</template>

<style scoped lang="scss">

</style>
