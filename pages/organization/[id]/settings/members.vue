<template>
  <div>
    <div class="universal-card">
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
            :disabled="(currentMember.organization_permissions & organizationPermissions.MANAGE_INVITES) !== organizationPermissions.MANAGE_INVITES"
          @keypress.enter="inviteTeamMember()"
        />
        <label for="username" class="hidden">Username</label>
        <button
          class="iconified-button brand-button"
            :disabled="(currentMember.organization_permissions & organizationPermissions.MANAGE_INVITES) !== organizationPermissions.MANAGE_INVITES"
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
    </div>
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
            :disabled="(currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER) !== organizationPermissions.EDIT_MEMBER"
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
            :disabled="(currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER) !== organizationPermissions.EDIT_MEMBER"
          />
        </div>
        <p v-if="member.role === 'Owner' && member.oldRole !== 'Owner'" class="known-errors">
          A project can only have one 'Owner'. Use the 'Transfer ownership' button below if you no
          longer wish to be owner.
        </p>
        <template v-if="member.oldRole !== 'Owner'">
          <span class="label">
            <span class="label__title">Project permissions</span>
          </span>
          <div class="permissions">
            <Checkbox
              :model-value="(member.permissions & projectPermissions.UPLOAD_VERSION) === projectPermissions.UPLOAD_VERSION"
              :disabled="
                (currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS) !== organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS ||
                (currentMember.permissions & projectPermissions.UPLOAD_VERSION) !== projectPermissions.UPLOAD_VERSION
              "
              label="Upload version"
              @update:model-value="allTeamMembers[index].permissions ^= projectPermissions.UPLOAD_VERSION"
            />
            <Checkbox
              :model-value="(member.permissions & projectPermissions.DELETE_VERSION) === projectPermissions.DELETE_VERSION"
              :disabled="
                (currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS) !== organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS ||
                (currentMember.permissions & projectPermissions.DELETE_VERSION) !== projectPermissions.DELETE_VERSION
              "
              label="Delete version"
              @update:model-value="allTeamMembers[index].permissions ^= projectPermissions.DELETE_VERSION"
            />
            <Checkbox
              :model-value="(member.permissions & projectPermissions.EDIT_DETAILS) === projectPermissions.EDIT_DETAILS"
              :disabled="
                (currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS) !== organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS ||
                (currentMember.permissions & projectPermissions.EDIT_DETAILS) !== projectPermissions.EDIT_DETAILS
              "
              label="Edit details"
              @update:model-value="allTeamMembers[index].permissions ^= projectPermissions.EDIT_DETAILS"
            />
            <Checkbox
              :model-value="(member.permissions & projectPermissions.EDIT_BODY) === projectPermissions.EDIT_BODY"
              :disabled="
                (currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS) !== organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS ||
                (currentMember.permissions & projectPermissions.EDIT_BODY) !== projectPermissions.EDIT_BODY
              "
              label="Edit body"
              @update:model-value="allTeamMembers[index].permissions ^= projectPermissions.EDIT_BODY"
            />
            <Checkbox
              :model-value="(member.permissions & projectPermissions.MANAGE_INVITES) === projectPermissions.MANAGE_INVITES"
              :disabled="
                (currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS) !== organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS ||
                (currentMember.permissions & projectPermissions.MANAGE_INVITES) !== projectPermissions.MANAGE_INVITES
              "
              label="Manage invites"
              @update:model-value="allTeamMembers[index].permissions ^= projectPermissions.MANAGE_INVITES"
            />
            <Checkbox
              :model-value="(member.permissions & projectPermissions.REMOVE_MEMBER) === projectPermissions.REMOVE_MEMBER"
              :disabled="
                (currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS) !== organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS ||
                (currentMember.permissions & projectPermissions.REMOVE_MEMBER) !== projectPermissions.REMOVE_MEMBER
              "
              label="Remove member"
              @update:model-value="allTeamMembers[index].permissions ^= projectPermissions.REMOVE_MEMBER"
            />
            <Checkbox
              :model-value="(member.permissions & projectPermissions.EDIT_MEMBER) === projectPermissions.EDIT_MEMBER"
              :disabled="(currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS) !== organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS"
              label="Edit member"
              @update:model-value="allTeamMembers[index].permissions ^= projectPermissions.EDIT_MEMBER"
            />
            <Checkbox
              :model-value="(member.permissions & projectPermissions.DELETE_PROJECT) === projectPermissions.DELETE_PROJECT"
              :disabled="
                (currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS) !== organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS ||
                (currentMember.permissions & projectPermissions.DELETE_PROJECT) !== projectPermissions.DELETE_PROJECT
              "
              label="Delete project"
              @update:model-value="allTeamMembers[index].permissions ^= projectPermissions.DELETE_PROJECT"
            />
            <Checkbox
              :model-value="(member.permissions & projectPermissions.VIEW_ANALYTICS) === projectPermissions.VIEW_ANALYTICS"
              :disabled="
                (currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS) !== organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS ||
                (currentMember.permissions & projectPermissions.VIEW_ANALYTICS) !== projectPermissions.VIEW_ANALYTICS
              "
              label="View analytics"
              @update:model-value="allTeamMembers[index].permissions ^= projectPermissions.VIEW_ANALYTICS"
            />
            <Checkbox
              :model-value="(member.permissions & projectPermissions.VIEW_PAYOUTS) === projectPermissions.VIEW_PAYOUTS"
              :disabled="
                (currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS) !== organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS ||
                (currentMember.permissions & projectPermissions.VIEW_PAYOUTS) !== projectPermissions.VIEW_PAYOUTS
              "
              label="View revenue"
              @update:model-value="allTeamMembers[index].permissions ^= projectPermissions.VIEW_PAYOUTS"
            />
          </div>
        </template>
        <template v-if="member.oldRole !== 'Owner'">
          <span class="label">
            <span class="label__title">Organization permissions</span>
          </span>
          <div class="permissions">
            <Checkbox
              :model-value="(member.organization_permissions & organizationPermissions.EDIT_DETAILS) === organizationPermissions.EDIT_DETAILS"
              :disabled="
                (currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER) !== organizationPermissions.EDIT_MEMBER ||
                (currentMember.organization_permissions & organizationPermissions.EDIT_DETAILS) !== organizationPermissions.EDIT_DETAILS
              "
              label="Edit details"
              @update:model-value="allTeamMembers[index].organization_permissions ^= organizationPermissions.EDIT_DETAILS"
            />
            <Checkbox
              :model-value="(member.organization_permissions & organizationPermissions.MANAGE_INVITES) === organizationPermissions.MANAGE_INVITES"
              :disabled="
                (currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER) !== organizationPermissions.EDIT_MEMBER ||
                (currentMember.organization_permissions & organizationPermissions.MANAGE_INVITES) !== organizationPermissions.MANAGE_INVITES
              "
              label="Manage invites"
              @update:model-value="allTeamMembers[index].organization_permissions ^= organizationPermissions.MANAGE_INVITES"
            />
            <Checkbox
              :model-value="(member.organization_permissions & organizationPermissions.REMOVE_MEMBER) === organizationPermissions.REMOVE_MEMBER"
              :disabled="
                (currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER) !== organizationPermissions.EDIT_MEMBER ||
                (currentMember.organization_permissions & organizationPermissions.REMOVE_MEMBER) !== organizationPermissions.REMOVE_MEMBER
              "
              label="Remove member"
              @update:model-value="allTeamMembers[index].organization_permissions ^= organizationPermissions.REMOVE_MEMBER"
            />
            <Checkbox
              :model-value="(member.organization_permissions & organizationPermissions.EDIT_MEMBER) === organizationPermissions.EDIT_MEMBER"
              :disabled="(currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER) !== organizationPermissions.EDIT_MEMBER"
              label="Edit member"
              @update:model-value="allTeamMembers[index].organization_permissions ^= organizationPermissions.EDIT_MEMBER"
            />
            <Checkbox
              :model-value="(member.organization_permissions & organizationPermissions.ADD_PROJECT) === organizationPermissions.ADD_PROJECT"
              :disabled="
                (currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER) !== organizationPermissions.EDIT_MEMBER ||
                (currentMember.organization_permissions & organizationPermissions.ADD_PROJECT) !== organizationPermissions.ADD_PROJECT
              "
              label="Add project"
              @update:model-value="allTeamMembers[index].organization_permissions ^= organizationPermissions.ADD_PROJECT"
            />
            <Checkbox
              :model-value="(member.organization_permissions & organizationPermissions.REMOVE_PROJECT) === organizationPermissions.REMOVE_PROJECT"
              :disabled="
                (currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER) !== organizationPermissions.EDIT_MEMBER ||
                (currentMember.organization_permissions & organizationPermissions.REMOVE_PROJECT) !== organizationPermissions.REMOVE_PROJECT
              "
              label="Remove project"
              @update:model-value="allTeamMembers[index].organization_permissions ^= organizationPermissions.REMOVE_PROJECT"
            />
            <Checkbox
              :model-value="(member.organization_permissions & organizationPermissions.DELETE_ORGANIZATION) === organizationPermissions.DELETE_ORGANIZATION"
              :disabled="
                (currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER) !== organizationPermissions.EDIT_MEMBER ||
                (currentMember.organization_permissions & organizationPermissions.DELETE_ORGANIZATION) !== organizationPermissions.DELETE_ORGANIZATION
              "
              label="Delete organization"
              @update:model-value="allTeamMembers[index].organization_permissions ^= organizationPermissions.DELETE_ORGANIZATION"
            />
            <Checkbox
              :model-value="(member.organization_permissions & organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS) === organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS"
              :disabled="
                (currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER) !== organizationPermissions.EDIT_MEMBER ||
                (currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS) !== organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS
              "
              label="Edit member default permissions"
              @update:model-value="allTeamMembers[index].organization_permissions ^= organizationPermissions.EDIT_MEMBER_DEFAULT_PERMISSIONS"
            />
          </div>
        </template>
        <div class="input-group">
          <button
            class="iconified-button brand-button"
            :disabled="(currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER) !== organizationPermissions.EDIT_MEMBER"
            @click="updateTeamMember(index)"
          >
            <SaveIcon />
            Save changes
          </button>
          <button
            v-if="member.oldRole !== 'Owner'"
            class="iconified-button danger-button"
            :disabled="(currentMember.organization_permissions & organizationPermissions.EDIT_MEMBER) !== organizationPermissions.EDIT_MEMBER"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Checkbox from '~/components/ui/Checkbox.vue'
import Badge from '~/components/ui/Badge.vue'
import DropdownIcon from '~/assets/images/utils/dropdown.svg'
import SaveIcon from '~/assets/images/utils/save.svg'
import TransferIcon from '~/assets/images/utils/transfer.svg'
import UserPlusIcon from '~/assets/images/utils/user-plus.svg'
import UserRemoveIcon from '~/assets/images/utils/user-x.svg'
import Avatar from '~/components/ui/Avatar.vue'
import { removeSelfFromTeam } from '~/helpers/teams.js'

const props = defineProps({
  organization: {
    type: Object,
    default: () => ({}),
  },
  currentMember: {
    type: Object,
    default: () => null,
  },
})

const currentUsername = ref('')
const openTeamMembers = ref([])
const allTeamMembers = ref(props.organization.members.map((x) => ({ ...x, oldRole: x.role })))
const appData = useNuxtApp()
const router = useRouter()

const projectPermissions = shallowRef({
  UPLOAD_VERSION : 1 << 0,
  DELETE_VERSION : 1 << 1,
  EDIT_DETAILS : 1 << 2,
  EDIT_BODY : 1 << 3,
  MANAGE_INVITES : 1 << 4,
  REMOVE_MEMBER : 1 << 5,
  EDIT_MEMBER : 1 << 6,
  DELETE_PROJECT : 1 << 7,
  VIEW_ANALYTICS : 1 << 8,
  VIEW_PAYOUTS : 1 << 9,
})

const organizationPermissions = shallowRef({
  EDIT_DETAILS : 1 << 0,
  MANAGE_INVITES : 1 << 1,
  REMOVE_MEMBER : 1 << 2,
  EDIT_MEMBER : 1 << 3,
  ADD_PROJECT : 1 << 4,
  REMOVE_PROJECT : 1 << 5,
  DELETE_ORGANIZATION : 1 << 6,
  EDIT_MEMBER_DEFAULT_PERMISSIONS : 1 << 7,
})

const leaveProject = async () => {
  await removeSelfFromTeam(props.organization.team_id)
  await router.push(`/organization/${props.organization.title}`)
}

const inviteTeamMember = async () => {
  startLoading()
  try {
    const user = await useBaseFetch(`user/${currentUsername.value}`)
    const data = {
      user_id: user.id.trim(),
    }
    await useBaseFetch(`team/${props.organization.team_id}/members`, {
      method: 'POST',
      body: data,
    })
    currentUsername.value = ''
    await updateMembers()
  } catch (err) {
    appData.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err.data.description,
      type: 'error',
    })
  }
  stopLoading()
}

const removeTeamMember = async (index) => {
  startLoading()
  try {
    await useBaseFetch(
      `team/${props.organization.team_id}/members/${allTeamMembers.value[index].user.id}`,
      {
        method: 'DELETE',
      }
    )
    await updateMembers()
  } catch (err) {
    appData.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err.data.description,
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
      `team/${props.organization.team_id}/members/${allTeamMembers.value[index].user.id}`,
      {
        method: 'PATCH',
        body: data,
      }
    )
    await updateMembers()
    appData.$notify({
      group: 'main',
      title: 'Member(s) updated',
      text: "Your project's member(s) has been updated.",
      type: 'success',
    })
  } catch (err) {
    appData.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err,
      type: 'error',
    })
  }
  stopLoading()
}

const transferOwnership = async (index) => {
  startLoading()
  try {
    await useBaseFetch(`team/${props.organization.team_id}/owner`, {
      method: 'PATCH',
      body: {
        user_id: allTeamMembers.value[index].user.id,
      },
    })
    await updateMembers()
  } catch (err) {
    appData.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err,
      type: 'error',
    })
  }
  stopLoading()
}

const updateMembers = async () => {
  allTeamMembers.value = (await useBaseFetch(`team/${props.organization.team_id}/members`)).map(
    (it) => ({
      avatar_url: it.user.avatar_url,
      name: it.user.username,
      oldRole: it.role,
      ...it,
    })
  )
}

onMounted(async () => {
  await updateMembers()
})
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
</style>
