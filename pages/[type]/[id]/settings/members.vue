<template>
  <div>
    <ModalConfirm
      ref="modal_remove"
      title="Are you sure you want to remove this project from the organization?"
      description="If you proceed, this project will no longer be managed by the organization."
      proceed-label="Remove"
      :noblur="!(cosmetics?.advancedRendering ?? true)"
      @proceed="onRemoveFromOrg"
    />
    <Card>
      <div class="label">
        <h3>
          <span class="label__title size-card-header">Manage members</span>
        </h3>
      </div>
      <span class="label">
        <span class="label__title">Invite a member</span>
        <span class="label__description">
          Enter the Modrinth username of the person you'd like to invite to be a member of this
          project.
        </span>
      </span>
      <div class="input-group">
        <input
          id="username"
          v-model="currentUsername"
          type="text"
          placeholder="Username"
          :disabled="(currentMember.permissions & MANAGE_INVITES) !== MANAGE_INVITES"
          @keypress.enter="inviteTeamMember()"
        />
        <label for="username" class="hidden">Username</label>
        <button
          class="iconified-button brand-button"
          :disabled="(currentMember.permissions & MANAGE_INVITES) !== MANAGE_INVITES"
          @click="inviteTeamMember()"
        >
          <UserPlusIcon />
          Invite
        </button>
      </div>
      <div class="adjacent-input">
        <span class="label">
          <span class="label__title">Leave project</span>
          <span class="label__description"> Remove yourself as a member of this project. </span>
        </span>
        <button
          class="iconified-button danger-button"
          :disabled="currentMember.role === 'Owner'"
          @click="leaveProject()"
        >
          <UserRemoveIcon />
          Leave project
        </button>
      </div>
    </Card>
    <div
      v-for="(member, index) in allTeamMembers"
      :key="member.user.id"
      class="universal-card member"
      :class="{ open: openTeamMembers.includes(member.user.id) }"
    >
      <div class="member-header">
        <div class="info">
          <Avatar :src="member.avatar_url" :alt="member.username" size="sm" circle />
          <div class="text">
            <nuxt-link :to="'/user/' + member.user.username" class="name">
              <p>{{ member.name }}</p>
            </nuxt-link>
            <p>{{ member.role }}</p>
          </div>
        </div>
        <div class="side-buttons">
          <Badge v-if="member.accepted" type="accepted" />
          <Badge v-else type="pending" />
          <button
            class="square-button dropdown-icon"
            @click="
              openTeamMembers.indexOf(member.user.id) === -1
                ? openTeamMembers.push(member.user.id)
                : (openTeamMembers = openTeamMembers.filter((it) => it !== member.user.id))
            "
          >
            <DropdownIcon />
          </button>
        </div>
      </div>
      <div class="content">
        <div v-if="member.oldRole !== 'Owner'" class="adjacent-input">
          <label :for="`member-${allTeamMembers[index].user.username}-role`">
            <span class="label__title">Role</span>
            <span class="label__description">
              The title of the role that this member plays for this project.
            </span>
          </label>
          <input
            :id="`member-${allTeamMembers[index].user.username}-role`"
            v-model="allTeamMembers[index].role"
            type="text"
            :class="{ 'known-error': member.role === 'Owner' }"
            :disabled="(currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER"
          />
        </div>
        <div class="adjacent-input">
          <label :for="`member-${allTeamMembers[index].user.username}-monetization-weight`">
            <span class="label__title">Monetization weight</span>
            <span class="label__description">
              Relative to all other members' monetization weights, this determines what portion of
              this project's revenue goes to this member.
            </span>
          </label>
          <input
            :id="`member-${allTeamMembers[index].user.username}-monetization-weight`"
            v-model="allTeamMembers[index].payouts_split"
            type="number"
            :disabled="(currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER"
          />
        </div>
        <p v-if="member.role === 'Owner' && member.oldRole !== 'Owner'" class="known-errors">
          A project can only have one 'Owner'. Use the 'Transfer ownership' button below if you no
          longer wish to be owner.
        </p>
        <template v-if="member.oldRole !== 'Owner'">
          <span class="label">
            <span class="label__title">Permissions</span>
          </span>
          <div class="permissions">
            <Checkbox
              :model-value="(member.permissions & UPLOAD_VERSION) === UPLOAD_VERSION"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & UPLOAD_VERSION) !== UPLOAD_VERSION
              "
              label="Upload version"
              @update:model-value="allTeamMembers[index].permissions ^= UPLOAD_VERSION"
            />
            <Checkbox
              :model-value="(member.permissions & DELETE_VERSION) === DELETE_VERSION"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & DELETE_VERSION) !== DELETE_VERSION
              "
              label="Delete version"
              @update:model-value="allTeamMembers[index].permissions ^= DELETE_VERSION"
            />
            <Checkbox
              :model-value="(member.permissions & EDIT_DETAILS) === EDIT_DETAILS"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & EDIT_DETAILS) !== EDIT_DETAILS
              "
              label="Edit details"
              @update:model-value="allTeamMembers[index].permissions ^= EDIT_DETAILS"
            />
            <Checkbox
              :model-value="(member.permissions & EDIT_BODY) === EDIT_BODY"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & EDIT_BODY) !== EDIT_BODY
              "
              label="Edit body"
              @update:model-value="allTeamMembers[index].permissions ^= EDIT_BODY"
            />
            <Checkbox
              :model-value="(member.permissions & MANAGE_INVITES) === MANAGE_INVITES"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & MANAGE_INVITES) !== MANAGE_INVITES
              "
              label="Manage invites"
              @update:model-value="allTeamMembers[index].permissions ^= MANAGE_INVITES"
            />
            <Checkbox
              :model-value="(member.permissions & REMOVE_MEMBER) === REMOVE_MEMBER"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & REMOVE_MEMBER) !== REMOVE_MEMBER
              "
              label="Remove member"
              @update:model-value="allTeamMembers[index].permissions ^= REMOVE_MEMBER"
            />
            <Checkbox
              :model-value="(member.permissions & EDIT_MEMBER) === EDIT_MEMBER"
              :disabled="(currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER"
              label="Edit member"
              @update:model-value="allTeamMembers[index].permissions ^= EDIT_MEMBER"
            />
            <Checkbox
              :model-value="(member.permissions & DELETE_PROJECT) === DELETE_PROJECT"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & DELETE_PROJECT) !== DELETE_PROJECT
              "
              label="Delete project"
              @update:model-value="allTeamMembers[index].permissions ^= DELETE_PROJECT"
            />
            <Checkbox
              :model-value="(member.permissions & VIEW_ANALYTICS) === VIEW_ANALYTICS"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & VIEW_ANALYTICS) !== VIEW_ANALYTICS
              "
              label="View analytics"
              @update:model-value="allTeamMembers[index].permissions ^= VIEW_ANALYTICS"
            />
            <Checkbox
              :model-value="(member.permissions & VIEW_PAYOUTS) === VIEW_PAYOUTS"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & VIEW_PAYOUTS) !== VIEW_PAYOUTS
              "
              label="View revenue"
              @update:model-value="allTeamMembers[index].permissions ^= VIEW_PAYOUTS"
            />
          </div>
        </template>
        <div class="input-group">
          <button
            class="iconified-button brand-button"
            :disabled="(currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER"
            @click="updateTeamMember(index)"
          >
            <SaveIcon />
            Save changes
          </button>
          <button
            v-if="member.oldRole !== 'Owner'"
            class="iconified-button danger-button"
            :disabled="(currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER"
            @click="removeTeamMember(index)"
          >
            <UserRemoveIcon />
            Remove member
          </button>
          <button
            v-if="member.oldRole !== 'Owner' && currentMember.role === 'Owner' && member.accepted"
            class="iconified-button"
            @click="transferOwnership(index)"
          >
            <TransferIcon />
            Transfer ownership
          </button>
        </div>
      </div>
    </div>
    <section class="universal-card">
      <div class="label">
        <span class="label__title size-card-header">Organization</span>
      </div>
      <p>
        <template v-if="props.organization">
          This project is managed by {{ organization.name }}. The defaults for member permissions
          are set in the
          <nuxt-link :to="`/organization/${organization.name}/settings/members`">
            organization settings</nuxt-link
          >. You may override them below.
        </template>
        <template v-else>
          This project is not managed by an organization. If you are the member of any
          organizations, you can transfer management to one of them.
        </template>
      </p>
      <div v-if="!props.organization" class="input-group">
        <Multiselect
          id="organization-picker"
          v-model="selectedOrganization"
          class="large-multiselect"
          track-by="id"
          label="name"
          open-direction="bottom"
          :close-on-select="true"
          :show-labels="false"
          :allow-empty="false"
          :options="organizations || []"
          :disabled="
            !currentMember || currentMember.role !== 'Owner' || organizations?.length === 0
          "
        />
        <button class="btn btn-primary" :disabled="!selectedOrganization" @click="onAddToOrg">
          <CheckIcon />
          Transfer management
        </button>
      </div>
      <button v-if="props.organization" class="btn" @click="$refs.modal_remove.show()">
        <OrganizationIcon />
        Remove from organization
      </button>
    </section>
    <div
      v-for="(member, index) in allOrgMembers"
      :key="member.user.id"
      class="universal-card member"
      :class="{ open: openTeamMembers.includes(member.user.id) }"
    >
      <div class="member-header">
        <div class="info">
          <Avatar :src="member.user.avatar_url" :alt="member.user.username" size="sm" circle />
          <div class="text">
            <nuxt-link :to="'/user/' + member.user.username" class="name">
              <p>{{ member.user.username }}</p>
            </nuxt-link>
            <p>{{ member.role }}</p>
          </div>
        </div>
        <div class="side-buttons">
          <Badge v-if="member.accepted" type="accepted" />
          <Badge v-else type="pending" />
          <button
            class="square-button dropdown-icon"
            @click="
              openTeamMembers.indexOf(member.user.id) === -1
                ? openTeamMembers.push(member.user.id)
                : (openTeamMembers = openTeamMembers.filter((it) => it !== member.user.id))
            "
          >
            <DropdownIcon />
          </button>
        </div>
      </div>
      <div class="content">
        <div class="adjacent-input">
          <label :for="`member-${allOrgMembers[index].user.username}-monetization-weight`">
            <span class="label__title">Monetization weight</span>
            <span class="label__description">
              Relative to all other members' monetization weights, this determines what portion of
              this project's revenue goes to this member.
            </span>
          </label>
          <input
            :id="`member-${allOrgMembers[index].user.username}-monetization-weight`"
            v-model="allOrgMembers[index].payouts_split"
            type="number"
            :disabled="(currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER"
          />
        </div>
        <template v-if="!member.is_owner">
          <span class="label">
            <span class="label__title">Permissions</span>
          </span>
          <div class="permissions">
            <Checkbox
              :model-value="(member.permissions & UPLOAD_VERSION) === UPLOAD_VERSION"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & UPLOAD_VERSION) !== UPLOAD_VERSION
              "
              label="Upload version"
              @update:model-value="allOrgMembers[index].permissions ^= UPLOAD_VERSION"
            />
            <Checkbox
              :model-value="(member.permissions & DELETE_VERSION) === DELETE_VERSION"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & DELETE_VERSION) !== DELETE_VERSION
              "
              label="Delete version"
              @update:model-value="allOrgMembers[index].permissions ^= DELETE_VERSION"
            />
            <Checkbox
              :model-value="(member.permissions & EDIT_DETAILS) === EDIT_DETAILS"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & EDIT_DETAILS) !== EDIT_DETAILS
              "
              label="Edit details"
              @update:model-value="allOrgMembers[index].permissions ^= EDIT_DETAILS"
            />
            <Checkbox
              :model-value="(member.permissions & EDIT_BODY) === EDIT_BODY"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & EDIT_BODY) !== EDIT_BODY
              "
              label="Edit body"
              @update:model-value="allOrgMembers[index].permissions ^= EDIT_BODY"
            />
            <Checkbox
              :model-value="(member.permissions & MANAGE_INVITES) === MANAGE_INVITES"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & MANAGE_INVITES) !== MANAGE_INVITES
              "
              label="Manage invites"
              @update:model-value="allOrgMembers[index].permissions ^= MANAGE_INVITES"
            />
            <Checkbox
              :model-value="(member.permissions & REMOVE_MEMBER) === REMOVE_MEMBER"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & REMOVE_MEMBER) !== REMOVE_MEMBER
              "
              label="Remove member"
              @update:model-value="allOrgMembers[index].permissions ^= REMOVE_MEMBER"
            />
            <Checkbox
              :model-value="(member.permissions & EDIT_MEMBER) === EDIT_MEMBER"
              :disabled="(currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER"
              label="Edit member"
              @update:model-value="allOrgMembers[index].permissions ^= EDIT_MEMBER"
            />
            <Checkbox
              :model-value="(member.permissions & DELETE_PROJECT) === DELETE_PROJECT"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & DELETE_PROJECT) !== DELETE_PROJECT
              "
              label="Delete project"
              @update:model-value="allOrgMembers[index].permissions ^= DELETE_PROJECT"
            />
            <Checkbox
              :model-value="(member.permissions & VIEW_ANALYTICS) === VIEW_ANALYTICS"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & VIEW_ANALYTICS) !== VIEW_ANALYTICS
              "
              label="View analytics"
              @update:model-value="allOrgMembers[index].permissions ^= VIEW_ANALYTICS"
            />
            <Checkbox
              :model-value="(member.permissions & VIEW_PAYOUTS) === VIEW_PAYOUTS"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
                (currentMember.permissions & VIEW_PAYOUTS) !== VIEW_PAYOUTS
              "
              label="View revenue"
              @update:model-value="allOrgMembers[index].permissions ^= VIEW_PAYOUTS"
            />
          </div>
        </template>
        <div class="input-group">
          <button
            class="iconified-button brand-button"
            :disabled="(currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER"
            @click="updateTeamMember(index)"
          >
            <SaveIcon />
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Multiselect } from 'vue-multiselect'
import { Avatar, Badge, Card, Checkbox, TransferIcon, CheckIcon } from 'omorphia'

import ModalConfirm from '~/components/ui/ModalConfirm.vue'
import DropdownIcon from '~/assets/images/utils/dropdown.svg'
import SaveIcon from '~/assets/images/utils/save.svg'
import UserPlusIcon from '~/assets/images/utils/user-plus.svg'
import UserRemoveIcon from '~/assets/images/utils/user-x.svg'
import OrganizationIcon from '~/assets/images/utils/organization.svg'

import { removeSelfFromTeam } from '~/helpers/teams.js'

const props = defineProps({
  project: {
    type: Object,
    default() {
      return {}
    },
  },
  organization: {
    type: Object,
    default() {
      return {}
    },
  },
  allMembers: {
    type: Array,
    default() {
      return []
    },
  },
  currentMember: {
    type: Object,
    default() {
      return null
    },
  },
  resetProject: {
    type: Function,
    required: true,
    default: () => {},
  },
  resetOrganization: {
    type: Function,
    required: true,
    default: () => {},
  },
  resetMembers: {
    type: Function,
    required: true,
    default: () => {},
  },
})

const cosmetics = useCosmetics()
const auth = await useAuth()

const currentUsername = ref('')
const openTeamMembers = ref([])
const allTeamMembers = ref(props.allMembers.map((x) => ({ ...x, oldRole: x.role })))
const allOrgMembers = ref(props.organization ? props.organization.members : [])
const selectedOrganization = ref(null)

const { data: organizations } = useAsyncData('organizations', () => {
  return useBaseFetch('user/' + auth.value?.user.id + '/organizations', {
    apiVersion: 3,
  })
})

const UPLOAD_VERSION = 1 << 0
const DELETE_VERSION = 1 << 1
const EDIT_DETAILS = 1 << 2
const EDIT_BODY = 1 << 3
const MANAGE_INVITES = 1 << 4
const REMOVE_MEMBER = 1 << 5
const EDIT_MEMBER = 1 << 6
const DELETE_PROJECT = 1 << 7
const VIEW_ANALYTICS = 1 << 8
const VIEW_PAYOUTS = 1 << 9

const onAddToOrg = useClientTry(async () => {
  if (!selectedOrganization.value) return

  await useBaseFetch(`organization/${selectedOrganization.value.id}/projects`, {
    method: 'POST',
    body: JSON.stringify({
      project_id: props.project.id,
    }),
    apiVersion: 3,
  })

  await updateMembers()

  addNotification({
    group: 'main',
    title: 'Project transferred',
    text: 'Your project has been transferred to the organization.',
    type: 'success',
  })
})

const onRemoveFromOrg = useClientTry(async () => {
  if (!props.project.organization || !auth.value?.user?.id) return

  await useBaseFetch(`organization/${props.project.organization}/projects/${props.project.id}`, {
    method: 'DELETE',
    body: JSON.stringify({
      new_owner: auth.value.user.id,
    }),
    apiVersion: 3,
  })

  await updateMembers()

  addNotification({
    group: 'main',
    title: 'Project removed',
    text: 'Your project has been removed from the organization.',
    type: 'success',
  })
})

const leaveProject = async () => {
  await removeSelfFromTeam(props.project.team)
  navigateTo('/dashboard/projects')
}

const inviteTeamMember = async () => {
  startLoading()

  try {
    const user = await useBaseFetch(`user/${currentUsername.value}`)
    const data = {
      user_id: user.id.trim(),
    }
    await useBaseFetch(`team/${props.project.team}/members`, {
      method: 'POST',
      body: data,
    })
    currentUsername.value = ''
    await updateMembers()
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: err?.data?.description || err?.message || err || 'Unknown error',
      type: 'error',
    })
  }

  stopLoading()
}

const removeTeamMember = async (index) => {
  startLoading()

  try {
    await useBaseFetch(
      `team/${props.project.team}/members/${allTeamMembers.value[index].user.id}`,
      {
        method: 'DELETE',
      }
    )
    await updateMembers()
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: err?.data?.description || err?.message || err || 'Unknown error',
      type: 'error',
    })
  }

  stopLoading()
}

const updateTeamMember = async (index) => {
  startLoading()

  try {
    const data =
      allTeamMembers.value[index].oldRole !== 'Owner'
        ? {
            permissions: allTeamMembers.value[index].permissions,
            role: allTeamMembers.value[index].role,
            payouts_split: allTeamMembers.value[index].payouts_split,
          }
        : {
            payouts_split: allTeamMembers.value[index].payouts_split,
          }

    await useBaseFetch(
      `team/${props.project.team}/members/${allTeamMembers.value[index].user.id}`,
      {
        method: 'PATCH',
        body: data,
      }
    )
    await updateMembers()
    addNotification({
      group: 'main',
      title: 'Member(s) updated',
      text: "Your project's member(s) has been updated.",
      type: 'success',
    })
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: err?.data?.description || err?.message || err || 'Unknown error',
      type: 'error',
    })
  }

  stopLoading()
}

const transferOwnership = async (index) => {
  startLoading()

  try {
    await useBaseFetch(`team/${props.project.team}/owner`, {
      method: 'PATCH',
      body: {
        user_id: allTeamMembers.value[index].user.id,
      },
    })
    await updateMembers()
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: err?.data?.description || err?.message || err || 'Unknown error',
      type: 'error',
    })
  }

  stopLoading()
}

const updateMembers = async () => {
  await Promise.all([props.resetProject(), props.resetOrganization(), props.resetMembers()])

  allTeamMembers.value = props.allMembers.map((x) => ({ ...x, oldRole: x.role }))
  allOrgMembers.value = props.organization ? props.organization.members : []

  const instance = getCurrentInstance()
  instance?.proxy?.$forceUpdate()

  // allTeamMembers.splice(
  //   0,
  //   allTeamMembers.length,
  //   ...(await useBaseFetch(`team/${props.project.team}/members`)).map((it) => ({
  //     avatar_url: it.user.avatar_url,
  //     name: it.user.username,
  //     oldRole: it.role,
  //     ...it,
  //   }))
  // )
}
</script>

<style lang="scss" scoped>
.member {
  .member-header {
    display: flex;
    justify-content: space-between;
    .info {
      display: flex;
      .text {
        margin: auto 0 auto 0.5rem;
        font-size: var(--font-size-sm);
        .name {
          font-weight: bold;
        }
        p {
          margin: 0.2rem 0;
        }
      }
    }
    .side-buttons {
      display: flex;
      align-items: center;
      .dropdown-icon {
        margin-left: 1rem;

        svg {
          transition: 150ms ease transform;
        }
      }
    }
  }

  .content {
    display: none;
    flex-direction: column;
    padding-top: var(--spacing-card-md);

    .main-info {
      margin-bottom: var(--spacing-card-lg);
    }
    .permissions {
      margin-bottom: var(--spacing-card-md);
      max-width: 45rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
      grid-gap: 0.5rem;
    }
  }

  &.open {
    .member-header {
      .dropdown-icon svg {
        transform: rotate(180deg);
      }
    }
    .content {
      display: flex;
    }
  }
}

.large-multiselect {
  max-width: 24rem;
}
</style>
