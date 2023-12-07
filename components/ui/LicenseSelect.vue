<template>
  <div class="license-options">
    <DropdownSelect
      v-model="selectedLicense"
      :options="defaultLicenses"
      :display-name="(o: License | undefined) => o?.friendly"
      :disabled="props.disabled"
    />
    <Checkbox
      v-model="allowOrLater"
      v-if="selectedLicense?.requiresOnlyOrLater"
      :disabled="props.disabled"
    >
      Allow later editions of this license
    </Checkbox>
    <template v-if="selectedLicense?.friendly === 'Custom'">
      <input
        v-model="customShortInput"
        type="text"
        maxlength="2048"
        placeholder="License name"
        :disabled="props.disabled"
      />
      <Checkbox v-model="customUseSPDX" :disabled="props.disabled">
        License does not have a SPDX identifier
      </Checkbox>
    </template>
    <input
      v-model="licenseURLInput"
      type="url"
      maxlength="2048"
      placeholder="License URL (optional)"
      :disabled="props.disabled || selectedLicense?.short === 'LicenseRef-Unknown'"
    />
  </div>
</template>

<script lang="ts" setup>
import { DropdownSelect, Checkbox } from 'omorphia'

type License = {
  friendly: string
  short: string
  requiresOnlyOrLater?: boolean
}

type ShortCode = {
  id: string
  url?: string
}

const defaultLicenses: License[] = [
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
]

const validURL = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const props = defineProps<{
  initialShortCode?: ShortCode
  disabled?: boolean
}>()
const emit = defineEmits<{
  'update:shortCode': [value: { id: string; url?: string }]
  'update:license': [license: License | null]
}>()

const selectedLicense = ref<License>()
const customShortInput = ref('')
const customUseSPDX = ref(false)
const allowOrLater = ref(false)

const licenseURLInput = ref('')

onMounted(() => {
  if (props.initialShortCode) {
    const id = props.initialShortCode.id
    const trimmedLicenseId = id
      .replaceAll('-only', '')
      .replaceAll('-or-later', '')
      .replaceAll('LicenseRef-', '')

    if (id.startsWith('LicenseRef-')) {
      customUseSPDX.value = true
    }

    const license = defaultLicenses.find((l) => l.short === trimmedLicenseId) as License | undefined

    if (!license) {
      selectedLicense.value = {
        friendly: 'Custom',
        short: '',
      }
      customShortInput.value = trimmedLicenseId
    } else {
      selectedLicense.value = license
      if (id.endsWith('-or-later')) {
        allowOrLater.value = true
      }
    }

    licenseURLInput.value = props.initialShortCode.url ?? ''
  }
})

watchEffect(() => {
  const license = selectedLicense.value

  if (!license) {
    emit('update:shortCode', { id: 'LicenseRef-Unknown' })
    emit('update:license', null)
    return
  }

  emit('update:license', license)

  // TODO: Construct shortcode and emit it
  let short = license.short

  if (license.friendly === 'Custom') {
    short = customShortInput.value
    short = short.trim().replaceAll(' ', '-')
    if (customUseSPDX.value) {
      short = 'LicenseRef-' + short
    }
  }

  if (license.requiresOnlyOrLater) {
    short += allowOrLater.value ? '-or-later' : '-only'
  }

  let url: string | undefined = licenseURLInput.value
  if (!validURL(url)) {
    url = undefined
  }

  emit('update:shortCode', {
    id: short,
    url,
  })
})
</script>

<style lang="scss" scoped>
.license-options {
  display: grid;
  gap: var(--gap-sm);

  max-width: 24rem; // Feel free to change this
}
</style>
