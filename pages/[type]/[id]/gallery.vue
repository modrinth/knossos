<template>
  <div>
    <Modal
      v-if="currentMember"
      ref="modalEditItem"
      :header="editIndex === -1 ? 'Upload gallery image' : 'Edit gallery item'"
      :noblur="!(cosmetics.advancedRendering ?? true)"
    >
      <div class="modal-gallery universal-labels">
        <div class="gallery-file-input">
          <div class="file-header">
            <ImageIcon />
            <strong>{{ editFile ? editFile.name : 'Current image' }}</strong>
            <FileInput
              v-if="editIndex === -1"
              class="btn raised"
              prompt="Replace"
              :accept="acceptFileTypes"
              :max-size="524288000"
              should-always-reset
              @change="
                (x) => {
                  editFile = x[0]
                  showPreviewImage()
                }
              "
            >
              <TransferIcon />
            </FileInput>
          </div>
          <img
            :src="
              previewImage
                ? previewImage
                : project.gallery[editIndex] && project.gallery[editIndex].url
                ? project.gallery[editIndex].url
                : 'https://cdn.modrinth.com/placeholder-banner.svg'
            "
            alt="gallery-preview"
          />
        </div>
        <label for="gallery-image-title">
          <span class="label__title">Title</span>
        </label>
        <input
          id="gallery-image-title"
          v-model="editTitle"
          type="text"
          maxlength="64"
          placeholder="Enter title..."
        />
        <label for="gallery-image-desc">
          <span class="label__title">Description</span>
        </label>
        <div class="textarea-wrapper">
          <textarea
            id="gallery-image-desc"
            v-model="editDescription"
            maxlength="255"
            placeholder="Enter description..."
          />
        </div>
        <label for="gallery-image-ordering">
          <span class="label__title">Order Index</span>
        </label>
        <input
          id="gallery-image-ordering"
          v-model="editOrder"
          type="number"
          placeholder="Enter order index..."
        />
        <label for="gallery-image-featured">
          <span class="label__title">Featured</span>
          <span class="label__description">
            A featured gallery image shows up in search and your project card. Only one gallery
            image can be featured.
          </span>
        </label>
        <button
          v-if="!editFeatured"
          id="gallery-image-featured"
          class="btn"
          @click="editFeatured = true"
        >
          <StarIcon aria-hidden="true" />
          Feature image
        </button>
        <button v-else id="gallery-image-featured" class="btn" @click="editFeatured = false">
          <StarIcon fill="currentColor" aria-hidden="true" />
          Unfeature image
        </button>
        <div class="input-group push-right">
          <button class="btn" @click="$refs.modalEditItem.hide()">
            <XIcon />
            Cancel
          </button>
          <button
            v-if="editIndex === -1"
            class="btn btn-primary"
            :disabled="shouldPreventActions"
            @click="createGalleryItem"
          >
            <PlusIcon />
            Add gallery image
          </button>
          <button
            v-else
            class="btn btn-primary"
            :disabled="shouldPreventActions"
            @click="editGalleryItem"
          >
            <SaveIcon />
            Save changes
          </button>
        </div>
      </div>
    </Modal>
    <ConfirmModal
      v-if="currentMember"
      ref="modal_confirm"
      title="Are you sure you want to delete this gallery image?"
      description="This will remove this gallery image forever (like really forever)."
      :has-to-type="false"
      proceed-label="Delete"
      :noblur="!(cosmetics.advancedRendering ?? true)"
      @proceed="deleteGalleryImage"
    />
    <div
      v-if="expandedGalleryItem != null"
      class="expanded-image-modal"
      @click="expandedGalleryItem = null"
    >
      <div class="content">
        <img
          class="image"
          :class="{ 'zoomed-in': zoomedIn }"
          :src="
            expandedGalleryItem.url
              ? expandedGalleryItem.url
              : 'https://cdn.modrinth.com/placeholder-banner.svg'
          "
          :alt="expandedGalleryItem.title ? expandedGalleryItem.title : 'gallery-image'"
          @click.stop
        />

        <div class="floating" @click.stop>
          <div class="text">
            <h2 v-if="expandedGalleryItem.title">
              {{ expandedGalleryItem.title }}
            </h2>
            <p v-if="expandedGalleryItem.description">
              {{ expandedGalleryItem.description }}
            </p>
          </div>
          <div class="controls">
            <div class="buttons">
              <button class="close circle-button" @click="expandedGalleryItem = null">
                <XIcon aria-hidden="true" />
              </button>
              <a
                class="open circle-button"
                target="_blank"
                :href="
                  expandedGalleryItem.url
                    ? expandedGalleryItem.url
                    : 'https://cdn.modrinth.com/placeholder-banner.svg'
                "
              >
                <ExternalIcon aria-hidden="true" />
              </a>
              <button class="circle-button" @click="zoomedIn = !zoomedIn">
                <ExpandIcon v-if="!zoomedIn" aria-hidden="true" />
                <ContractIcon v-else aria-hidden="true" />
              </button>
              <button
                v-if="project.gallery.length > 1"
                class="previous circle-button"
                @click="previousImage()"
              >
                <LeftArrowIcon aria-hidden="true" />
              </button>
              <button
                v-if="project.gallery.length > 1"
                class="next circle-button"
                @click="nextImage()"
              >
                <RightArrowIcon aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="currentMember" class="card header-buttons">
      <FileInput
        :max-size="524288000"
        :accept="acceptFileTypes"
        prompt="Upload an image"
        class="btn-primary btn"
        @change="handleFiles"
      >
        <UploadIcon />
      </FileInput>
      <span class="indicator">
        <InfoIcon /> Click to choose an image or drag one onto this page
      </span>
      <DropArea :accept="acceptFileTypes" @change="handleFiles" />
    </div>
    <div class="items">
      <div v-for="(item, index) in project.gallery" :key="index" class="card gallery-item">
        <a class="gallery-thumbnail" @click="expandImage(item, index)">
          <img
            :src="item.url ? item.url : 'https://cdn.modrinth.com/placeholder-banner.svg'"
            :alt="item.title ? item.title : 'gallery-image'"
          />
        </a>
        <div class="gallery-body">
          <div class="gallery-info">
            <h2 v-if="item.title">
              {{ item.title }}
            </h2>
            <p v-if="item.description">
              {{ item.description }}
            </p>
          </div>
        </div>
        <div class="gallery-bottom">
          <div class="gallery-created">
            <CalendarIcon />
            {{ dayjs(item.created).format('MMMM D, YYYY') }}
          </div>
          <div v-if="currentMember" class="gallery-buttons input-group">
            <button
              class="btn"
              @click="
                () => {
                  resetEdit()
                  editIndex = index
                  editTitle = item.title
                  editDescription = item.description
                  editFeatured = item.featured
                  editOrder = item.ordering
                  $refs.modalEditItem.show()
                }
              "
            >
              <EditIcon />
              Edit
            </button>
            <button
              class="btn"
              @click="
                () => {
                  deleteIndex = index
                  $refs.modal_confirm.show()
                }
              "
            >
              <TrashIcon />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import {
  PlusIcon,
  CalendarIcon,
  TrashIcon,
  XIcon,
  RightArrowIcon,
  LeftArrowIcon,
  EditIcon,
  SaveIcon,
  ExternalIcon,
  ExpandIcon,
  ContractIcon,
  StarIcon,
  UploadIcon,
  InfoIcon,
  ImageIcon,
  TransferIcon,
  FileInput,
  DropArea,
  Modal,
  ConfirmModal,
} from 'omorphia'
import { getProjectTypeForUrl } from '~/helpers/projects.js'

const cosmetics = useCosmetics()

const props = defineProps({
  project: {
    type: Object,
    default() {
      return {}
    },
  },
  currentMember: {
    type: Object,
    default() {
      return null
    },
  },
})

const title = `${props.project.title} - Gallery`
const description = `View ${props.project.gallery.length} images of ${props.project.title} on Modrinth.`

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
})

const expandedGalleryItem = ref(null)
const expandedGalleryIndex = ref(0)
const zoomedIn = ref(false)

const deleteIndex = ref(-1)

const editIndex = ref(-1)
const editTitle = ref('')
const editDescription = ref('')
const editFeatured = ref(false)
const editOrder = ref(null)
const editFile = ref(null)
const previewImage = ref(null)
const shouldPreventActions = ref(false)

const acceptFileTypes = ref('image/png,image/jpeg,image/gif,image/webp,.png,.jpeg,.gif,.webp')

const modalEditItem = ref()

function nextImage() {
  expandedGalleryIndex.value++
  if (expandedGalleryIndex.value >= props.project.gallery.length) {
    expandedGalleryIndex.value = 0
  }
  expandedGalleryItem.value = props.project.gallery[expandedGalleryIndex.value]
}

function previousImage() {
  expandedGalleryIndex.value--
  if (expandedGalleryIndex.value < 0) {
    expandedGalleryIndex.value = props.project.gallery.length - 1
  }
  expandedGalleryItem.value = props.project.gallery[expandedGalleryIndex.value]
}

function expandImage(item, index) {
  expandedGalleryItem.value = item
  expandedGalleryIndex.value = index
  zoomedIn.value = false
}

function resetEdit() {
  editIndex.value = -1
  editTitle.value = ''
  editDescription.value = ''
  editFeatured.value = false
  editOrder.value = null
  editFile.value = null
  previewImage.value = null
}

function handleFiles(files) {
  resetEdit()
  editFile.value = files[0]

  showPreviewImage()
  modalEditItem.value.show()
}

function showPreviewImage() {
  const reader = new FileReader()
  if (editFile.value instanceof Blob) {
    reader.readAsDataURL(editFile.value)
    reader.onload = (event) => {
      previewImage.value = event.target.result
    }
  }
}

async function createGalleryItem() {
  shouldPreventActions.value = true
  startLoading()

  try {
    let url = `project/${props.project.id}/gallery?ext=${
      editFile.value
        ? editFile.value.type.split('/')[editFile.value.type.split('/').length - 1]
        : null
    }&featured=${editFeatured.value}`

    if (editTitle.value) {
      url += `&title=${encodeURIComponent(editTitle.value)}`
    }
    if (editDescription.value) {
      url += `&description=${encodeURIComponent(editDescription.value)}`
    }
    if (editOrder.value) {
      url += `&ordering=${editOrder.value}`
    }

    await useBaseFetch(url, {
      method: 'POST',
      body: editFile.value,
    })
    await updateProject()

    modalEditItem.value.hide()
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: err.data ? err.data.description : err,
      type: 'error',
    })
  }

  stopLoading()
  shouldPreventActions.value = false
}

async function editGalleryItem() {
  shouldPreventActions.value = true
  startLoading()

  try {
    let url = `project/${props.project.id}/gallery?url=${encodeURIComponent(
      props.project.gallery[editIndex.value].url
    )}&featured=${editFeatured.value}`

    if (editTitle.value) {
      url += `&title=${encodeURIComponent(editTitle.value)}`
    }
    if (editDescription.value) {
      url += `&description=${encodeURIComponent(editDescription.value)}`
    }
    if (editOrder.value) {
      url += `&ordering=${editOrder.value}`
    }

    await useBaseFetch(url, {
      method: 'PATCH',
    })

    await updateProject()
    modalEditItem.value.hide()
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: err.data ? err.data.description : err,
      type: 'error',
    })
  }

  stopLoading()
  shouldPreventActions.value = false
}

async function deleteGalleryImage() {
  startLoading()

  try {
    await useBaseFetch(
      `project/${props.project.id}/gallery?url=${encodeURIComponent(
        props.project.gallery[deleteIndex.value].url
      )}`,
      {
        method: 'DELETE',
      }
    )

    await updateProject()
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: err.data ? err.data.description : err,
      type: 'error',
    })
  }

  stopLoading()
}

const emit = defineEmits(['update:project'])
async function updateProject() {
  const project = await useBaseFetch(`project/${props.project.id}`)

  project.actualProjectType = JSON.parse(JSON.stringify(project.project_type))

  project.project_type = getProjectTypeForUrl(project.project_type, project.loaders)

  emit('update:project', project)
  resetEdit()
}

onMounted(() => {
  document.addEventListener('keydown', keyListener)
})

onUnmounted(() => {
  document.removeEventListener('keydown', keyListener)
})

function keyListener(e) {
  if (expandedGalleryItem.value) {
    e.preventDefault()
    if (e.key === 'Escape') {
      expandedGalleryItem.value = null
    } else if (e.key === 'ArrowLeft') {
      previousImage()
    } else if (e.key === 'ArrowRight') {
      nextImage()
    }
  }
}
</script>

<style lang="scss" scoped>
.header-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;

  .indicator {
    display: flex;
    gap: 0.5ch;
    align-items: center;
    color: var(--color-secondary);
  }
}

.expanded-image-modal {
  position: fixed;
  z-index: 20;
  overflow: auto;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000000;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    position: relative;
    width: calc(100vw - 2 * var(--gap-xl));
    height: calc(100vh - 2 * var(--gap-xl));

    .circle-button {
      cursor: pointer;
      padding: 0.5rem;
      line-height: 1;
      display: flex;
      max-width: 2rem;
      color: var(--color-contrast);
      background-color: var(--color-button-bg);
      border-radius: var(--radius-max);
      margin: 0;
      box-shadow: inset 0px -1px 1px rgb(17 24 39 / 10%);

      &:not(:last-child) {
        margin-right: 0.5rem;
      }

      &:hover {
        filter: var(--filter-hover);
      }

      &:active {
        filter: var(--filter-active);
      }

      svg {
        height: 1rem;
        width: 1rem;
      }
    }

    .image {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      max-width: calc(100vw - 2 * var(--gap-xl));
      max-height: calc(100vh - 2 * var(--gap-xl));
      border-radius: var(--round-card);

      &.zoomed-in {
        object-fit: cover;
        width: auto;
        height: calc(100vh - 2 * var(--gap-xl));
        max-width: calc(100vw - 2 * var(--gap-xl));
      }
    }
    .floating {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: var(--gap-md);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--gap-sm);
      transition: opacity 0.25s ease-in-out;
      opacity: 1;
      padding: 2rem 2rem 0 2rem;

      &:not(&:hover) {
        opacity: 0.4;
        .text {
          transform: translateY(2.5rem) scale(0.8);
          opacity: 0;
        }
        .controls {
          transform: translateY(0.25rem) scale(0.9);
        }
      }

      .text {
        display: flex;
        flex-direction: column;
        max-width: 40rem;
        transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
        text-shadow: 1px 1px 10px #000000d4;
        margin-bottom: 0.25rem;
        gap: 0.5rem;

        h2 {
          color: var(--dark-color-contrast);
          font-size: 1.25rem;
          text-align: center;
          margin: 0;
        }

        p {
          color: var(--dark-color-contrast);
          margin: 0;
        }
      }
      .controls {
        background-color: var(--color-raised-bg);
        padding: var(--gap-md);
        border-radius: var(--round-card);
        transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
      }
    }
  }
}

.buttons {
  display: flex;

  button {
    margin-right: 0.5rem;
  }
}

.items {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  grid-gap: var(--gap-md);

  @media screen and (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.gallery-item {
  display: flex;
  flex-direction: column;
  padding: 0;

  img {
    width: 100%;
    margin-top: 0;
    margin-bottom: 0;
    border-radius: var(--round-card) var(--round-card) 0 0;

    min-height: 10rem;
    object-fit: cover;
  }

  .gallery-body {
    flex-grow: 1;
    width: calc(100% - 2 * var(--gap-md));
    padding: var(--gap-sm) var(--gap-md);

    .gallery-info {
      h2 {
        margin-bottom: 0.5rem;
      }

      p {
        margin: 0 0 0.5rem 0;
      }
    }
  }

  .gallery-thumbnail {
    cursor: pointer;

    img {
      transition: filter 0.25s ease-in-out;

      &:hover {
        filter: brightness(0.7);
      }
    }
  }

  .gallery-bottom {
    width: calc(100% - 2 * var(--gap-md));
    padding: 0 var(--gap-md) var(--gap-sm) var(--gap-md);

    .gallery-created {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      color: var(--color-secondary);

      svg {
        width: 1rem;
        height: 1rem;
        margin-right: 0.25rem;
      }
    }

    .gallery-buttons {
      display: flex;
    }

    .columns {
      margin-bottom: 0.5rem;
    }
  }
}

.modal-gallery {
  padding: var(--gap-lg);
  display: flex;
  flex-direction: column;

  .gallery-file-input {
    .file-header {
      border-radius: var(--round-card) var(--round-card) 0 0;

      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: var(--color-button-bg);
      padding: var(--gap-md);

      svg {
        min-width: 1rem;
      }
      strong {
        word-wrap: anywhere;
      }

      .btn {
        margin-left: auto;
      }
    }

    img {
      border-radius: 0 0 var(--round-card) var(--round-card);
      width: 100%;
      height: auto;
      max-height: 15rem;
      object-fit: contain;
      background-color: #000000;
    }
  }
}
</style>
