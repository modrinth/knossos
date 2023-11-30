<template>
  <div>
    <div class="card">
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
          class="btn btn-primary"
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
          class="btn btn-red"
          :disabled="currentMember.role === 'Owner'"
          @click="leaveProject()"
        >
          <UserXIcon />
          Leave project
        </button>
      </div>
    </div>
    <div
      v-for="(member, index) in allTeamMembers"
      :key="member.user.id"
      class="card member"
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
            class="btn icon-only dropdown-icon"
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
            class="btn btn-primary"
            :disabled="(currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER"
            @click="updateTeamMember(index)"
          >
            <SaveIcon />
            Save changes
          </button>
          <button
            v-if="member.oldRole !== 'Owner'"
            class="btn btn-red"
            :disabled="(currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER"
            @click="removeTeamMember(index)"
          >
            <UserXIcon />
            Remove member
          </button>
          <button
            v-if="member.oldRole !== 'Owner' && currentMember.role === 'Owner' && member.accepted"
            class="btn"
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
import {
  Checkbox,
  Badge,
  DropdownIcon,
  SaveIcon,
  TransferIcon,
  UserPlusIcon,
  UserXIcon,
  Avatar,
} from 'omorphia'
import { removeSelfFromTeam } from '~/helpers/teams.js'

const props = defineProps({
  project: {
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
})

const router = useRouter()

const UPLOAD_VERSION = ref(1 << 0)
const DELETE_VERSION = ref(1 << 1)
const EDIT_DETAILS = ref(1 << 2)
const EDIT_BODY = ref(1 << 3)
const MANAGE_INVITES = ref(1 << 4)
const REMOVE_MEMBER = ref(1 << 5)
const EDIT_MEMBER = ref(1 << 6)
const DELETE_PROJECT = ref(1 << 7)
const VIEW_ANALYTICS = ref(1 << 8)
const VIEW_PAYOUTS = ref(1 << 9)

const currentUsername = ref('')
const openTeamMembers = ref([])
const allTeamMembers = ref(
  props.allMembers.map((x) => {
    x.oldRole = x.role
    return x
  })
)

async function leaveProject() {
  await removeSelfFromTeam(props.project.team)
  await router.push('/projects')
}

async function inviteTeamMember() {
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
      text: err.data.description,
      type: 'error',
    })
  }

  stopLoading()
}

async function removeTeamMember(index) {
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
      text: err.data.description,
      type: 'error',
    })
  }

  stopLoading()
}

async function updateTeamMember(index) {
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
      text: err.data.description,
      type: 'error',
    })
  }

  stopLoading()
}

async function transferOwnership(index) {
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
      text: err.data.description,
      type: 'error',
    })
  }

  stopLoading()
}

async function updateMembers() {
  allTeamMembers.value = (await useBaseFetch(`team/${props.project.team}/members`)).map((it) => ({
    avatar_url: it.user.avatar_url,
    name: it.user.username,
    oldRole: it.role,
    ...it,
  }))
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
    padding-top: var(--gap-md);

    .main-info {
      margin-bottom: var(--gap-xl);
    }
    .permissions {
      margin-bottom: var(--gap-md);
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
