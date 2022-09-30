<template>
  <div>
    <ModalConfirm
      ref="modal_confirm"
      title="Are you sure you want to delete this project?"
      description="If you proceed, all versions and any attached data will be removed from our servers. This may break other projects, so be careful."
      :has-to-type="true"
      :confirmation-text="project.title"
      proceed-label="Delete"
      @proceed="deleteProject"
    />
    <div class="card">
      <h3>{{ $t('project.settings.general.title') }}</h3>
    </div>
    <section class="card main-settings">
      <label>
        <span>
          <h3>{{ $t('project.settings.general.edit.title') }}</h3>
          <span>
            {{ $t('project.settings.general.edit.description') }}
          </span>
        </span>
        <div>
          <nuxt-link class="iconified-button" to="edit">
            <EditIcon /> {{ $t('project.settings.general.edit.action') }}
          </nuxt-link>
        </div>
      </label>
      <label>
        <span>
          <h3>{{ $t('project.settings.general.create-version.title') }}</h3>
          <span>
            {{ $t('project.settings.general.create-version.description') }}
          </span>
        </span>
        <div>
          <nuxt-link
            class="iconified-button"
            to="version/create"
            :disabled="
              (currentMember.permissions & UPLOAD_VERSION) !== UPLOAD_VERSION
            "
          >
            <PlusIcon />
            {{ $t('project.settings.general.create-version.action') }}
          </nuxt-link>
        </div>
      </label>
      <label class="no-margin">
        <span>
          <h3>{{ $t('project.settings.general.delete-project.title') }}</h3>
          <span>
            {{ $t('project.settings.general.delete-project.description') }}
          </span>
        </span>
        <div>
          <button
            class="iconified-button danger-button"
            :disabled="
              (currentMember.permissions & DELETE_PROJECT) !== DELETE_PROJECT
            "
            @click="$refs.modal_confirm.show()"
          >
            <TrashIcon />
            {{ $t('project.settings.general.delete-project.action') }}
          </button>
        </div>
      </label>
    </section>
    <div class="card columns team-invite">
      <h3>{{ $t('project.settings.team-members.title') }}</h3>
      <div
        v-if="(currentMember.permissions & MANAGE_INVITES) === MANAGE_INVITES"
        class="column"
      >
        <input
          id="username"
          v-model="currentUsername"
          type="text"
          :placeholder="
            $t('project.settings.invite-member.username.placeholder')
          "
        />
        <label for="username" class="hidden">
          {{ $t('project.settings.invite-member.username.label') }}
        </label>
        <button
          class="iconified-button brand-button column"
          @click="inviteTeamMember"
        >
          <PlusIcon /> {{ $t('project.settings.invite-member.action') }}
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
          <Avatar
            :src="member.avatar_url"
            :alt="member.username"
            size="sm"
            circle
          />
          <div class="text">
            <nuxt-link :to="'/user/' + member.user.username" class="name">
              <p>{{ member.name }}</p>
            </nuxt-link>
            <p>
              {{ member.role }}
            </p>
          </div>
        </div>
        <div class="side-buttons">
          <Badge
            v-if="member.accepted"
            :type="$t('project.settings.team-member.status.accepted')"
            color="green"
          />
          <Badge
            v-else
            :type="$t('project.settings.team-member.status.pending')"
            color="yellow"
          />
          <button
            v-if="member.role !== 'Owner'"
            class="dropdown-icon"
            @click="
              openTeamMembers.indexOf(member.user.id) === -1
                ? openTeamMembers.push(member.user.id)
                : (openTeamMembers = openTeamMembers.filter(
                    (it) => it !== member.user.id
                  ))
            "
          >
            <DropdownIcon />
          </button>
        </div>
      </div>
      <div class="content">
        <div class="main-info">
          <label>
            {{ $t('project.settings.team-member.role.label') }}
            <input
              v-model="allTeamMembers[index].role"
              type="text"
              :class="{ 'known-error': member.role === 'Owner' }"
              :disabled="
                (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER
              "
            />
          </label>
          <ul v-if="member.role === 'Owner'" class="known-errors">
            <li>{{ $t('project.settings.error.only-one-owner') }}</li>
          </ul>
        </div>
        <h3>{{ $t('project.settings.team-member.permissions.title') }}</h3>
        <div class="permissions">
          <Checkbox
            :value="(member.permissions & UPLOAD_VERSION) === UPLOAD_VERSION"
            :disabled="
              (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
              (currentMember.permissions & UPLOAD_VERSION) !== UPLOAD_VERSION
            "
            :label="
              $t('project.settings.team-member.permission.upload-version')
            "
            @input="allTeamMembers[index].permissions ^= UPLOAD_VERSION"
          />
          <Checkbox
            :value="(member.permissions & DELETE_VERSION) === DELETE_VERSION"
            :disabled="
              (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
              (currentMember.permissions & DELETE_VERSION) !== DELETE_VERSION
            "
            :label="
              $t('project.settings.team-member.permission.delete-version')
            "
            @input="allTeamMembers[index].permissions ^= DELETE_VERSION"
          />
          <Checkbox
            :value="(member.permissions & EDIT_DETAILS) === EDIT_DETAILS"
            :disabled="
              (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
              (currentMember.permissions & EDIT_DETAILS) !== EDIT_DETAILS
            "
            :label="$t('project.settings.team-member.permission.edit-details')"
            @input="allTeamMembers[index].permissions ^= EDIT_DETAILS"
          />
          <Checkbox
            :value="(member.permissions & EDIT_BODY) === EDIT_BODY"
            :disabled="
              (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
              (currentMember.permissions & EDIT_BODY) !== EDIT_BODY
            "
            :label="$t('project.settings.team-member.permission.edit-body')"
            @input="allTeamMembers[index].permissions ^= EDIT_BODY"
          />
          <Checkbox
            :value="(member.permissions & MANAGE_INVITES) === MANAGE_INVITES"
            :disabled="
              (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
              (currentMember.permissions & MANAGE_INVITES) !== MANAGE_INVITES
            "
            :label="
              $t('project.settings.team-member.permission.manage-invites')
            "
            @input="allTeamMembers[index].permissions ^= MANAGE_INVITES"
          />
          <Checkbox
            :value="(member.permissions & REMOVE_MEMBER) === REMOVE_MEMBER"
            :disabled="
              (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
              (currentMember.permissions & REMOVE_MEMBER) !== REMOVE_MEMBER
            "
            :label="$t('project.settings.team-member.permission.remove-member')"
            @input="allTeamMembers[index].permissions ^= REMOVE_MEMBER"
          />
          <Checkbox
            :value="(member.permissions & EDIT_MEMBER) === EDIT_MEMBER"
            :disabled="
              (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER
            "
            :label="$t('project.settings.team-member.permission.edit-member')"
            @input="allTeamMembers[index].permissions ^= EDIT_MEMBER"
          />
          <Checkbox
            :value="(member.permissions & DELETE_PROJECT) === DELETE_PROJECT"
            :disabled="
              (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
              (currentMember.permissions & DELETE_PROJECT) !== DELETE_PROJECT
            "
            :label="
              $t('project.settings.team-member.permission.delete-project')
            "
            @input="allTeamMembers[index].permissions ^= DELETE_PROJECT"
          />
        </div>
        <div class="actions">
          <button
            class="iconified-button"
            :disabled="
              (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER
            "
            @click="removeTeamMember(index)"
          >
            <TrashIcon />
            {{ $t('project.settings.team-member.actions.remove') }}
          </button>
          <button
            v-if="
              member.role !== 'Owner' &&
              currentMember.role === 'Owner' &&
              member.accepted
            "
            class="iconified-button"
            @click="transferOwnership(index)"
          >
            <UserIcon />
            {{ $t('project.settings.team-member.actions.make-owner') }}
          </button>
          <button
            class="iconified-button brand-button"
            :disabled="
              (currentMember.permissions & EDIT_MEMBER) !== EDIT_MEMBER ||
              member.role === 'Owner'
            "
            @click="updateTeamMember(index)"
          >
            <CheckIcon />
            {{ $t('project.settings.team-member.actions.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModalConfirm from '~/components/ui/ModalConfirm'
import Checkbox from '~/components/ui/Checkbox'
import Badge from '~/components/ui/Badge'

import DropdownIcon from '~/assets/images/utils/dropdown.svg?inline'
import PlusIcon from '~/assets/images/utils/plus.svg?inline'
import CheckIcon from '~/assets/images/utils/check.svg?inline'
import EditIcon from '~/assets/images/utils/edit.svg?inline'
import TrashIcon from '~/assets/images/utils/trash.svg?inline'
import UserIcon from '~/assets/images/utils/user.svg?inline'
import Avatar from '~/components/ui/Avatar'

export default {
  components: {
    Avatar,
    DropdownIcon,
    ModalConfirm,
    Checkbox,
    Badge,
    PlusIcon,
    CheckIcon,
    EditIcon,
    TrashIcon,
    UserIcon,
  },
  props: {
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
  },
  data() {
    return {
      currentUsername: '',
      openTeamMembers: [],
      allTeamMembers: [],
    }
  },
  fetch() {
    this.allTeamMembers = this.allMembers
  },
  created() {
    this.UPLOAD_VERSION = 1 << 0
    this.DELETE_VERSION = 1 << 1
    this.EDIT_DETAILS = 1 << 2
    this.EDIT_BODY = 1 << 3
    this.MANAGE_INVITES = 1 << 4
    this.REMOVE_MEMBER = 1 << 5
    this.EDIT_MEMBER = 1 << 6
    this.DELETE_PROJECT = 1 << 7
  },
  methods: {
    async inviteTeamMember() {
      this.$nuxt.$loading.start()

      try {
        const user = (await this.$axios.get(`user/${this.currentUsername}`))
          .data

        const data = {
          user_id: user.id,
        }

        await this.$axios.post(
          `team/${this.project.team}/members`,
          data,
          this.$defaultHeaders()
        )
        await this.updateMembers()
      } catch (err) {
        this.$notify({
          group: 'main',
          title: this.$t('error.generic'),
          text: err.response.data.description,
          type: 'error',
        })
      }

      this.$nuxt.$loading.finish()
    },
    async removeTeamMember(index) {
      this.$nuxt.$loading.start()

      try {
        await this.$axios.delete(
          `team/${this.project.team}/members/${this.allTeamMembers[index].user.id}`,
          this.$defaultHeaders()
        )
        await this.updateMembers()
      } catch (err) {
        this.$notify({
          group: 'main',
          title: this.$t('error.generic'),
          text: err.response.data.description,
          type: 'error',
        })
      }

      this.$nuxt.$loading.finish()
    },
    async updateTeamMember(index) {
      this.$nuxt.$loading.start()

      try {
        const data = {
          permissions: this.allTeamMembers[index].permissions,
          role: this.allTeamMembers[index].role,
        }

        await this.$axios.patch(
          `team/${this.project.team}/members/${this.allTeamMembers[index].user.id}`,
          data,
          this.$defaultHeaders()
        )
        await this.updateMembers()
      } catch (err) {
        this.$notify({
          group: 'main',
          title: this.$t('error.generic'),
          text: err.response.data.description,
          type: 'error',
        })
      }

      this.$nuxt.$loading.finish()
    },
    async transferOwnership(index) {
      this.$nuxt.$loading.start()

      try {
        await this.$axios.patch(
          `team/${this.project.team}/owner`,
          {
            user_id: this.allTeamMembers[index].user.id,
          },
          this.$defaultHeaders()
        )
        await this.updateMembers()
      } catch (err) {
        this.$notify({
          group: 'main',
          title: this.$t('error.generic'),
          text: err.response.data.description,
          type: 'error',
        })
      }

      this.$nuxt.$loading.finish()
    },
    async deleteProject() {
      await this.$axios.delete(
        `project/${this.project.id}`,
        this.$defaultHeaders()
      )
      await this.$store.dispatch('user/fetchProjects')
      await this.$router.push(`/user/${this.$auth.user.username}`)
      this.$notify({
        group: 'main',
        title: this.$t('project.settings.deleted.title'),
        text: this.$t('project.settings.text'),
        type: 'success',
      })
    },
    async updateMembers() {
      this.allTeamMembers = (
        await this.$axios.get(
          `team/${this.project.team}/members`,
          this.$defaultHeaders()
        )
      ).data.map((it) => ({
        avatar_url: it.user.avatar_url,
        name: it.user.username,
        ...it,
      }))
    },
  },
}
</script>

<style lang="scss" scoped>
.card {
  h3 {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
}

.member {
  margin-bottom: var(--spacing-card-md);

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
        cursor: pointer;
        color: var(--color-text-dark);
        background-color: unset;
        transition: 150ms ease transform;
        padding: unset;
      }
    }
  }

  .content {
    display: none;

    .main-info {
      margin-bottom: var(--spacing-card-lg);

      @media screen and (min-width: 1024px) {
        label {
          align-items: center;
          input {
            margin-left: 1rem;
          }
        }
      }
    }
    .permissions {
      margin: 1rem 0;
      max-width: 45rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
      grid-gap: 0.5rem;

      label {
        flex-direction: row;
        input {
          flex: none;
          margin-right: 0.5rem;
        }
      }
    }
  }

  &.open {
    .member-header {
      .dropdown-icon {
        transform: rotate(180deg);
      }
    }
    .content {
      display: unset;
      margin: var(--spacing-card-lg);
    }
  }
}

input,
button {
  &:disabled {
    cursor: not-allowed !important;
  }
}

section {
  margin-bottom: var(--spacing-card-md);

  label {
    display: flex;

    span {
      flex: 2;
      padding-right: var(--spacing-card-lg);
    }

    div {
      flex: none;
      width: fit-content;
    }

    input {
      flex: 3;
      height: fit-content;
    }
  }
}

.team-invite {
  gap: 0.5rem;
  @media screen and (max-width: 1024px) {
    flex-direction: column;
    h3 {
      margin-bottom: 0.5rem;
    }
  }

  h3 {
    margin: auto auto auto 0;
  }

  > div {
    display: flex;
    align-items: center;

    input {
      margin-right: 1rem;
    }

    @media screen and (max-width: 500px) {
      display: flex;
      flex-direction: column;

      input {
        margin: 0;
      }

      button {
        margin-top: 0.5rem;
      }
    }
  }
}

.actions {
  display: flex;

  button {
    margin-right: 0.5rem;

    &:first-child {
      margin-left: auto;
    }
  }
}

.main-settings span {
  margin-bottom: 1rem;
}
</style>
