<template>
  <div>
    <section class="card">
      <div class="adjacent-input">
        <label for="license-multiselect">
          <span class="label__title size-card-header">License</span>
          <span class="label__description">
            It is very important to choose a proper license for your
            {{ formatProjectType(project.project_type).toLowerCase() }}. You may choose one from
            our list or provide a custom license. You may also provide a custom URL to your chosen
            license; otherwise, the license text will be displayed.
            <span v-if="license && license.friendly === 'Custom'" class="label__subdescription">
              Enter a valid
              <a href="https://spdx.org/licenses/" target="_blank" rel="noopener" class="text-link">
                SPDX license identifier</a
              >
              in the marked area. If your license does not have a SPDX identifier (for example, if
              you created the license yourself or if the license is Minecraft-specific), simply
              check the box and enter the name of the license instead.
            </span>
            <span class="label__subdescription">
              Confused? See our
              <a
                href="https://blog.modrinth.com/licensing-guide/"
                target="_blank"
                rel="noopener"
                class="text-link"
              >
                licensing guide</a
              >
              for more information.
            </span>
          </span>
        </label>
        <div class="input-stack">
          <Multiselect
            id="license-multiselect"
            v-model="license"
            placeholder="Select license..."
            track-by="short"
            label="friendly"
            :options="defaultLicenses"
            :searchable="true"
            :close-on-select="true"
            :show-labels="false"
            :class="{
              'known-error': license?.short === '' && showKnownErrors,
            }"
            :disabled="!hasPermission"
          />
          <Checkbox
            v-if="license?.requiresOnlyOrLater"
            v-model="allowOrLater"
            :disabled="!hasPermission"
            description="Allow later editions of this license"
          >
            Allow later editions of this license
          </Checkbox>
          <Checkbox
            v-if="license?.friendly === 'Custom'"
            v-model="nonSpdxLicense"
            :disabled="!hasPermission"
            description="License does not have a SPDX identifier"
          >
            License does not have a SPDX identifier
          </Checkbox>
          <input
            v-if="license?.friendly === 'Custom'"
            v-model="license.short"
            type="text"
            maxlength="2048"
            :placeholder="nonSpdxLicense ? 'License name' : 'SPDX identifier'"
            :class="{
              'known-error': license.short === '' && showKnownErrors,
            }"
            :disabled="!hasPermission"
          />
          <input
            v-model="licenseUrl"
            type="url"
            maxlength="2048"
            placeholder="License URL (optional)"
            :disabled="!hasPermission || licenseId === 'LicenseRef-Unknown'"
          />
        </div>
      </div>
      <div class="input-stack">
        <button
          type="button"
          class="btn btn-primary"
          :disabled="!hasChanges || license === null"
          @click="saveChanges()"
        >
          <SaveIcon />
          Save changes
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Checkbox, SaveIcon, formatProjectType } from 'omorphia'
import Multiselect from 'vue-multiselect'

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
  patchProject: {
    type: Function,
    default() {
      return () => {
        addNotification({
          group: 'main',
          title: 'An error occurred',
          text: 'Patch project function not found',
          type: 'error',
        })
      }
    },
  },
})

const allowOrLater = ref(props.project.license.id.includes('-or-later'))
const nonSpdxLicense = ref(props.project.license.id.includes('LicenseRef-'))
const showKnownErrors = ref(false)

const defaultLicenses = shallowRef([
  { friendly: 'Custom', short: '' },
  {
    friendly: 'All Rights Reserved/No License',
    short: 'All-Rights-Reserved',
  },
  { friendly: 'Apache License 2.0', short: 'Apache-2.0' },
  {
    friendly: 'BSD 2-Clause "Simplified" License',
    short: 'BSD-2-Clause',
  },
  {
    friendly: 'BSD 3-Clause "New" or "Revised" License',
    short: 'BSD-3-Clause',
  },
  {
    friendly: 'CC Zero (Public Domain equivalent)',
    short: 'CC0-1.0',
  },
  { friendly: 'CC-BY 4.0', short: 'CC-BY-4.0' },
  {
    friendly: 'CC-BY-SA 4.0',
    short: 'CC-BY-SA-4.0',
  },
  {
    friendly: 'CC-BY-NC 4.0',
    short: 'CC-BY-NC-4.0',
  },
  {
    friendly: 'CC-BY-NC-SA 4.0',
    short: 'CC-BY-NC-SA-4.0',
  },
  {
    friendly: 'CC-BY-ND 4.0',
    short: 'CC-BY-ND-4.0',
  },
  {
    friendly: 'CC-BY-NC-ND 4.0',
    short: 'CC-BY-NC-ND-4.0',
  },
  {
    friendly: 'GNU Affero General Public License v3',
    short: 'AGPL-3.0',
    requiresOnlyOrLater: true,
  },
  {
    friendly: 'GNU Lesser General Public License v2.1',
    short: 'LGPL-2.1',
    requiresOnlyOrLater: true,
  },
  {
    friendly: 'GNU Lesser General Public License v3',
    short: 'LGPL-3.0',
    requiresOnlyOrLater: true,
  },
  {
    friendly: 'GNU General Public License v2',
    short: 'GPL-2.0',
    requiresOnlyOrLater: true,
  },
  {
    friendly: 'GNU General Public License v3',
    short: 'GPL-3.0',
    requiresOnlyOrLater: true,
  },
  { friendly: 'ISC License', short: 'ISC' },
  { friendly: 'MIT License', short: 'MIT' },
  { friendly: 'Mozilla Public License 2.0', short: 'MPL-2.0' },
  { friendly: 'zlib License', short: 'Zlib' },
])

const licenseUrl = ref(props.project.license.url)

const trimmedLicenseId = props.project.license.id
  .replaceAll('-only', '')
  .replaceAll('-or-later', '')
  .replaceAll('LicenseRef-', '')

const license = ref(
  defaultLicenses.value.find((x) => x.short === trimmedLicenseId) ?? {
    friendly: 'Custom',
    short: props.project.license.id.replaceAll('LicenseRef-', ''),
  }
)

if (props.project.license.id === 'LicenseRef-Unknown') {
  license.value = {
    friendly: 'Unknown',
    short: licenseId.replaceAll('LicenseRef-', ''),
  }
}

const hasPermission = computed(() => {
  const EDIT_DETAILS = 1 << 2
  return (props.currentMember.permissions & EDIT_DETAILS) === EDIT_DETAILS
})

const licenseId = computed(() => {
  let id = ''
  if (license.value === null) return id
  if (
    (nonSpdxLicense.value && license.value.friendly === 'Custom') ||
    license.value.short === 'All-Rights-Reserved' ||
    license.value.short === 'Unknown'
  ) {
    id += 'LicenseRef-'
  }
  id += license.value.short
  if (license.value.requiresOnlyOrLater) {
    id += allowOrLater.value ? '-or-later' : '-only'
  }
  if (nonSpdxLicense.value && license.value.friendly === 'Custom') {
    id = id.replaceAll(' ', '-')
  }
  return id
})

const patchData = computed(() => {
  const data = {}

  if (licenseId.value !== props.project.license.id) {
    data.license_id = licenseId.value
    data.license_url = licenseUrl.value ? licenseUrl.value : null
  } else if (licenseUrl.value !== props.project.license.url) {
    data.license_url = licenseUrl.value ? licenseUrl.value : null
  }

  return data
})

const hasChanges = computed(() => Object.keys(patchData.value).length > 0)

function saveChanges() {
  if (hasChanges.value) {
    props.patchProject(patchData.value)
  }
}
</script>
