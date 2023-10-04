<template>
  <span :class="'badge ' + color + ' type--' + type">
    <template v-if="color"> <span class="circle" /> {{ $capitalizeString(type) }}</template>

    <!-- User roles -->
    <template v-else-if="type === 'admin'"> <ModrinthIcon /> {{ formatMessage(messages.adminLabel) }}</template>
    <template v-else-if="type === 'moderator'"> <ModeratorIcon /> {{ formatMessage(messages.moderatorLabel) }}</template>
    <template v-else-if="type === 'creator'"><CreatorIcon /> {{ formatMessage(messages.creatorLabel) }}</template>

    <!-- Project statuses -->
    <template v-else-if="type === 'approved'"><ListIcon /> {{ formatMessage(messages.approvedLabel) }}</template>
    <template v-else-if="type === 'approved-general'"><CheckIcon /> {{ formatMessage(messages.approvedGeneralLabel) }}</template>
    <template v-else-if="type === 'unlisted'"><EyeOffIcon /> {{ formatMessage(messages.unlistedLabel) }}</template>
    <template v-else-if="type === 'withheld'"><EyeOffIcon /> {{ formatMessage(messages.withheldLabel) }}</template>
    <template v-else-if="type === 'private'"><LockIcon /> {{ formatMessage(messages.privateLabel) }}</template>
    <template v-else-if="type === 'scheduled'"> <CalendarIcon /> {{ formatMessage(messages.scheduledLabel) }}</template>
    <template v-else-if="type === 'draft'"><DraftIcon /> {{ formatMessage(messages.draftLabel) }}</template>
    <template v-else-if="type === 'archived'"> <ArchiveIcon /> {{ formatMessage(messages.archivedLabel) }}</template>
    <template v-else-if="type === 'rejected'"><CrossIcon /> {{ formatMessage(messages.rejectedLabel) }}</template>
    <template v-else-if="type === 'processing'"> <ProcessingIcon /> {{ formatMessage(messages.processingLabel) }}</template>

    <!-- Team members -->
    <template v-else-if="type === 'accepted'"><CheckIcon /> {{ formatMessage(messages.acceptedLabel) }}</template>
    <template v-else-if="type === 'pending'"> <ProcessingIcon /> {{ formatMessage(messages.pendingLabel) }} </template>

    <!-- Transaction statuses -->
    <template v-else-if="type === 'success'"><CheckIcon /> {{ formatMessage(messages.successLabel) }}</template>

    <!-- Report status -->
    <template v-else-if="type === 'closed'"> <CloseIcon /> {{ formatMessage(messages.closedLabel) }}</template>

    <!-- Other -->
    <template v-else> <span class="circle" /> {{ $capitalizeString(type) }} </template>
  </span>
</template>

<script setup>
import ModrinthIcon from '~/assets/images/logo.svg'
import ModeratorIcon from '~/assets/images/sidebar/admin.svg'
import CreatorIcon from '~/assets/images/utils/box.svg'
import ListIcon from '~/assets/images/utils/list.svg'
import EyeOffIcon from '~/assets/images/utils/eye-off.svg'
import DraftIcon from '~/assets/images/utils/file-text.svg'
import CrossIcon from '~/assets/images/utils/x.svg'
import ArchiveIcon from '~/assets/images/utils/archive.svg'
import ProcessingIcon from '~/assets/images/utils/updated.svg'
import CheckIcon from '~/assets/images/utils/check.svg'
import LockIcon from '~/assets/images/utils/lock.svg'
import CalendarIcon from '~/assets/images/utils/calendar.svg'
import CloseIcon from '~/assets/images/utils/check-circle.svg'

const { formatMessage } = useVIntl()

const messages = defineMessages({
  acceptedLabel: {
    id: 'component.badge.label.accepted',
    defaultMessage: 'Accepted',
  },
  adminLabel: {
    id: 'component.badge.label.admin',
    defaultMessage: 'Modrinth Team',
  },
  approvedLabel: {
    id: 'component.badge.label.approved',
    defaultMessage: 'Listed',
  },
  approvedGeneralLabel: {
    id: 'component.badge.label.approved-general',
    defaultMessage: 'Approved',
  },
  archivedLabel: {
    id: 'component.badge.label.archived',
    defaultMessage: 'Archived',
  },
  closedLabel: {
    id: 'component.badge.label.closed',
    defaultMessage: 'Closed',
  },
  creatorLabel: {
    id: 'component.badge.label.creator',
    defaultMessage: 'Creator',
  },
  draftLabel: {
    id: 'component.badge.label.draft',
    defaultMessage: 'Draft',
  },
  moderatorLabel: {
    id: 'component.badge.label.moderator',
    defaultMessage: 'Moderator',
  },
  pendingLabel: {
    id: 'component.badge.label.pending',
    defaultMessage: 'Pending',
  },
  privateLabel: {
    id: 'component.badge.label.private',
    defaultMessage: 'Private',
  },
  processingLabel: {
    id: 'component.badge.label.processing',
    defaultMessage: 'Under review',
  },
  rejectedLabel: {
    id: 'component.badge.label.rejected',
    defaultMessage: 'Rejected',
  },
  scheduledLabel: {
    id: 'component.badge.label.scheduled',
    defaultMessage: 'Scheduled',
  },
  successLabel: {
    id: 'component.badge.label.success',
    defaultMessage: 'Success',
  },
  unlistedLabel: {
    id: 'component.badge.label.unlisted',
    defaultMessage: 'Unlisted',
  },
  withheldLabel: {
    id: 'component.badge.label.withheld',
    defaultMessage: 'Withheld',
  },
})

defineProps({
  type: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss" scoped>
.badge {
  font-weight: bold;
  width: fit-content;
  --badge-color: var(--color-special-gray);
  color: var(--badge-color);
  white-space: nowrap;

  .circle {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    display: inline-block;
    margin-right: 0.25rem;
    background-color: var(--badge-color);
  }

  svg {
    vertical-align: -15%;
    width: 1em;
    height: 1em;
  }

  &.type--closed,
  &.type--withheld,
  &.type--rejected,
  &.red {
    --badge-color: var(--color-special-red);
  }

  &.type--pending,
  &.type--moderator,
  &.type--processing,
  &.type--scheduled,
  &.orange {
    --badge-color: var(--color-special-orange);
  }

  &.type--accepted,
  &.type--admin,
  &.type--success,
  &.type--approved-general,
  &.green {
    --badge-color: var(--color-special-green);
  }

  &.type--creator,
  &.type--approved,
  &.blue {
    --badge-color: var(--color-special-blue);
  }

  &.type--unlisted,
  &.purple {
    --badge-color: var(--color-special-purple);
  }

  &.type--private,
  &.gray {
    --badge-color: var(--color-special-gray);
  }
}
</style>
