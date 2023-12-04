<template>
  <div
    class="notification"
    :class="{
      'has-body': hasBody,
      read: notification.read,
    }"
  >
    <nuxt-link
      v-if="!type"
      :to="notification.link"
      class="notification__icon backed-svg"
      :class="{ raised: raised }"
    >
      <NotificationIcon />
    </nuxt-link>
    <DoubleIcon v-else class="notification__icon" :color="iconColor">
      <template #primary>
        <nuxt-link v-if="project" :to="getProjectLink(project)" tabindex="-1">
          <Avatar size="xs" :src="project.icon_url" :raised="raised" no-shadow />
        </nuxt-link>
        <nuxt-link v-else-if="user" :to="getUserLink(user)" tabindex="-1">
          <Avatar size="xs" :src="user.avatar_url" :raised="raised" no-shadow />
        </nuxt-link>
        <Avatar v-else size="xs" :raised="raised" no-shadow />
      </template>
      <template #secondary>
        <ModerationIcon
          v-if="type === 'moderator_message' || type === 'status_change'"
          class="moderation-color"
        />
        <InvitationIcon v-else-if="type === 'team_invite' && project" />
        <VersionIcon v-else-if="type === 'project_update' && project && version" />
        <NotificationIcon v-else />
      </template>
    </DoubleIcon>
    <div class="notification__title">
      <div class="title-text">
        <template v-if="type === 'project_update' && project && version">
          <nuxt-link :to="getProjectLink(project)" class="title-link">{{
            project.title
          }}</nuxt-link>
          released
          {{
            groupedVersionNotifs.length > 1
              ? `${groupedVersionNotifs.length} new versions`
              : `a new version`
          }}.
        </template>
        <template v-else-if="type === 'team_invite' && project">
          <nuxt-link :to="`/user/${invitedBy.username}`" class="iconified-link title-link">
            <Avatar :src="invitedBy.avatar_url" circle size="xxs" no-shadow :raised="raised" />
            <span class="space">&nbsp;</span>
            <span>{{ invitedBy.username }}</span>
          </nuxt-link>
          <span>
            invited you to join
            <nuxt-link :to="getProjectLink(project)" class="title-link">
              {{ project.title }} </nuxt-link
            >.
          </span>
        </template>
        <template v-else-if="type === 'status_change' && project">
          <nuxt-link :to="getProjectLink(project)" class="title-link">
            {{ project.title }}
          </nuxt-link>
          <template v-if="tags.rejectedStatuses.includes(notification.body.new_status)">
            has been <Badge :type="notification.body.new_status" />
          </template>
          <template v-else>
            updated from
            <Badge :type="notification.body.old_status" />
            to
            <Badge :type="notification.body.new_status" />
          </template>
          by the moderators.
        </template>
        <template v-else-if="type === 'moderator_message' && thread && project && !report">
          Your project,
          <nuxt-link :to="getProjectLink(project)" class="title-link">{{ project.title }}</nuxt-link
          >, has received
          <template v-if="notification.grouped_notifs"> messages </template>
          <template v-else>a message</template>
          from the moderators.
        </template>
        <template v-else-if="type === 'moderator_message' && thread && report">
          A moderator replied to your report of
          <template v-if="version">
            version
            <nuxt-link :to="getVersionLink(project, version)" class="title-link">
              {{ version.name }}
            </nuxt-link>
            of project
          </template>
          <nuxt-link v-if="project" :to="getProjectLink(project)" class="title-link">
            {{ project.title }}
          </nuxt-link>
          <nuxt-link v-else-if="user" :to="getUserLink(user)" class="title-link">
            {{ user.username }} </nuxt-link
          >.
        </template>
        <nuxt-link v-else :to="notification.link" class="title-link">
          <span v-html="renderString(notification.title)" />
        </nuxt-link>
        <!--      <span v-else class="known-errors">Error reading notification.</span>-->
      </div>
      <span class="title-date">
        <span v-tooltip="dayjs(notification.created).format('MMMM D, YYYY [at] h:mm A')">
          {{ fromNow(notification.created) }}
        </span>
      </span>
    </div>
    <div v-if="hasBody" class="notification__body">
      <ThreadSummary
        v-if="type === 'moderator_message' && thread"
        :thread="thread"
        :link="threadLink"
        :raised="raised"
        :messages="getMessages()"
        class="thread-summary"
        :auth="auth"
      />
      <div v-else-if="type === 'project_update'" class="version-list">
        <div
          v-for="notif in groupedVersionNotifs.length > 3 && !showAllVersions
            ? groupedVersionNotifs.slice(0, 2)
            : groupedVersionNotifs"
          :key="notif.id"
          class="version-link"
        >
          <div class="title">
            <nuxt-link
              :to="getVersionLink(notif.extra_data.project, notif.extra_data.version)"
              class="text-link"
            >
              {{ notif.extra_data.version.name }}
            </nuxt-link>
          </div>
          <div class="version-info">
            <div class="primary-stat">
              <GameIcon class="primary-stat__icon" aria-hidden="true" />
              <div class="primary-stat__text">
                Minecraft
                <span class="primary-stat__counter">
                  {{
                    notif.extra_data.version.game_versions.length > 3
                      ? formats.list([
                          ...notif.extra_data.version.game_versions.slice(0, 3).reverse(),
                          `${notif.extra_data.version.game_versions.length - 1} more`,
                        ])
                      : formats.list(notif.extra_data.version.game_versions.slice().reverse())
                  }}
                </span>
              </div>
            </div>
            <div
              v-if="
                !(
                  notif.extra_data.version.loaders.length === 1 &&
                  notif.extra_data.version.loaders[0] === 'datapack'
                ) && project.project_type !== 'resourcepack'
              "
              class="primary-stat"
            >
              <WrenchIcon class="primary-stat__icon" aria-hidden="true" />
              <div class="primary-stat__text">
                Supports
                <span class="primary-stat__counter">
                  {{ formats.list(notif.extra_data.version.loaders.map((x) => formatCategory(x))) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Checkbox
          v-if="groupedVersionNotifs.length > 3"
          v-model="showAllVersions"
          collapsing-toggle-style
        >
          {{ showAllVersions ? 'Less versions' : 'More versions' }}
        </Checkbox>
      </div>
      <template v-else>
        {{ notification.text }}
      </template>
    </div>
    <div class="notification__actions">
      <div v-if="type !== null" class="input-group">
        <template v-if="type === 'team_invite' && !notification.read">
          <button
            class="btn btn-primary"
            @click="
              () => {
                acceptTeamInvite(notification.body.team_id)
                read()
              }
            "
          >
            <CheckIcon /> Accept
          </button>
          <button
            class="btn btn-red"
            @click="
              () => {
                removeSelfFromTeam(notification.body.team_id)
                read()
              }
            "
          >
            <CrossIcon /> Decline
          </button>
        </template>
        <CopyCode v-if="cosmetics.developerMode" :text="notification.id" />
      </div>
      <div v-else class="input-group">
        <nuxt-link
          v-if="notification.link && notification.link !== '#'"
          class="btn"
          :class="{ raised: raised }"
          :to="notification.link"
          target="_blank"
        >
          <ExternalIcon />
          Open link
        </nuxt-link>
        <button
          v-for="(action, actionIndex) in notification.actions"
          :key="actionIndex"
          class="btn"
          :class="{ raised: raised }"
          @click="performAction(notification, actionIndex)"
        >
          <CheckIcon v-if="action.title === 'Accept'" />
          <CrossIcon v-else-if="action.title === 'Deny'" />
          {{ action.title }}
        </button>
        <CopyCode v-if="cosmetics.developerMode" :text="notification.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import {
  UserPlusIcon as InvitationIcon,
  ScaleIcon as ModerationIcon,
  BellIcon as NotificationIcon,
  VersionIcon,
  CheckIcon,
  XIcon as CrossIcon,
  ExternalIcon,
  getProjectLink,
  getVersionLink,
  getUserLink,
  renderString,
  formatCategory,
  DoubleIcon,
  Avatar,
  Badge,
  CopyCode,
  Checkbox,
} from 'omorphia'
import WrenchIcon from 'assets/images/utils/wrench.svg'
import GameIcon from 'assets/images/utils/game.svg'
import ThreadSummary from '~/components/ui/thread/ThreadSummary.vue'
import { acceptTeamInvite, removeSelfFromTeam } from '~/helpers/teams.js'

const emit = defineEmits(['update:notifications'])
const vintl = useVIntl()
const { formats } = vintl

const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
  notifications: {
    type: Array,
    required: true,
  },
  raised: {
    type: Boolean,
    default: false,
  },
  auth: {
    type: Object,
    required: true,
  },
})

const cosmetics = useCosmetics()
const tags = useTags()

const type = computed(() =>
  !props.notification.body || props.notification.body.type === 'legacy_markdown'
    ? null
    : props.notification.body.type
)
const thread = computed(() => props.notification.extra_data.thread)
const report = computed(() => props.notification.extra_data.report)
const project = computed(() => props.notification.extra_data.project)
const version = computed(() => props.notification.extra_data.version)
const user = computed(() => props.notification.extra_data.user)
const invitedBy = computed(() => props.notification.extra_data.invited_by)

const iconColor = computed(() => {
  switch (type.value) {
    case 'team_invite':
      return 'blue'
    case 'project_update':
    default:
      return 'gray'
  }
})

const threadLink = computed(() => {
  if (report.value) {
    return `/report/${report.value.id}`
  } else if (project.value) {
    return `${getProjectLink(project.value)}/moderation#messages`
  }
  return '#'
})

const hasBody = computed(() => !type.value || thread.value || type.value === 'project_update')

const showAllVersions = ref(false)

const groupedVersionNotifs = computed(() => {
  const notifs = (
    props.notification.grouped_notifs
      ? [props.notification, ...props.notification.grouped_notifs]
      : [props.notification]
  ).filter((x) => x.extra_data.version)
  return notifs
})

async function read() {
  try {
    const ids = [
      props.notification.id,
      ...(props.notification.grouped_notifs
        ? props.notification.grouped_notifs.map((notif) => notif.id)
        : []),
    ]
    const updateNotifs = await markAsRead(ids)
    const newNotifs = updateNotifs(props.notifications)
    emit('update:notifications', newNotifs)
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'Error marking notification as read',
      text: err.data ? err.data.description : err,
      type: 'error',
    })
  }
}

async function performAction(notification, actionIndex) {
  startLoading()
  try {
    await read()

    await userDeleteNotification(notification.id)

    if (actionIndex !== null) {
      await useBaseFetch(`${notification.actions[actionIndex].action_route[1]}`, {
        method: notification.actions[actionIndex].action_route[0].toUpperCase(),
      })
    }
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

function getMessages() {
  const messages = []
  if (props.notification.body.message_id) {
    messages.push(props.notification.body.message_id)
  }
  if (props.notification.grouped_notifs) {
    for (const notif of props.notification.grouped_notifs) {
      if (notif.body.message_id) {
        messages.push(notif.body.message_id)
      }
    }
  }
  return messages
}
</script>

<style lang="scss" scoped>
.notification {
  display: grid;
  grid-template:
    'icon title'
    'icon date'
    'actions actions';
  grid-template-columns: min-content 1fr;
  grid-template-rows: min-content min-content min-content;
  gap: var(--gap-sm);

  &.has-body {
    grid-template:
      'icon title'
      'icon date'
      'body body'
      'actions actions';
    grid-template-columns: min-content 1fr;
    grid-template-rows: min-content min-content auto auto;
  }

  .label__title,
  .label__description,
  h1,
  h2,
  h3,
  h4,
  :deep(p) {
    margin: 0 !important;
  }

  .notification__icon {
    grid-area: icon;
  }

  .notification__title {
    grid-area: title;
    color: var(--color-base);
    filter: brightness(1.1);
    margin-block: auto;
    display: inline-block;
    vertical-align: middle;
    line-height: 1.25rem;

    .iconified-link {
      display: inline;

      img {
        vertical-align: middle;
        position: relative;
        top: -2px;
      }
    }

    .title-date {
      color: var(--color-secondary);
      font-size: var(--font-size-sm);
    }
  }
  .notification__body {
    grid-area: body;

    .version-list {
      margin: 0;
      padding: 0;
      list-style-type: none;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: var(--gap-sm);
      grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));

      .version-link {
        display: flex;
        flex-direction: column;
        gap: var(--gap-sm);
        padding: 1rem;
        background-color: var(--color-bg);
        border: 1px solid var(--color-divider);
        border-radius: var(--radius-md);

        .title {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--gap-xs);
        }

        .version-info {
          display: grid;
          grid-template-columns: 1fr 1fr;

          .primary-stat {
            margin: 0;
          }
        }
      }
    }
  }

  .notification__actions {
    grid-area: actions;
    display: flex;
    flex-direction: row;
    gap: var(--gap-sm);
  }

  .title-link {
    &:not(:hover) {
      text-decoration: none;
    }
    font-weight: bold;
  }
}
</style>
