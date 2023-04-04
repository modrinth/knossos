<template>
  <div class="report">
    <div v-if="report.item_type === 'project'" class="item-info">
      <nuxt-link :to="`/project/${report.project.slug}`" class="iconified-stacked-link">
        <Avatar :src="report.project.icon_url" size="xs" no-shadow :raised="raised"/>
        <div class="stacked">
          <span class="title">{{ report.project.title }}</span>
          <span>{{ $formatProjectType($getProjectTypeForUrl(report.project.project_type, report.project.loaders)) }}</span>
        </div>
      </nuxt-link>
    </div>
    <div v-else-if="report.item_type === 'user'" class="item-info">
      <nuxt-link :to="`/user/${report.user.username}`" class="iconified-stacked-link">
        <Avatar :src="report.user.avatar_url" circle size="xs" no-shadow :raised="raised"/>
        <div class="stacked">
          <span class="title">{{ report.user.username }}</span>
          <span>User</span>
        </div>
      </nuxt-link>
    </div>
    <div v-else-if="report.item_type === 'version'" class="item-info">
      <nuxt-link :to="`/project/${report.project.slug}/version/${report.version.id}`" class="iconified-link">
        <div class="backed-svg" :class="{'raised': raised}"><VersionIcon /></div>
        <span class="title">{{ report.version.name }}</span>
      </nuxt-link>
      of
      <nuxt-link :to="`/project/${report.project.slug}`" class="iconified-stacked-link">
        <Avatar :src="report.project.icon_url" size="xs" no-shadow :raised="raised"/>
        <div class="stacked">
          <span class="title">{{ report.project.title }}</span>
          <span>{{ $formatProjectType($getProjectTypeForUrl(report.project.project_type, report.project.loaders)) }}</span>
        </div>
      </nuxt-link>
    </div>
    <div v-else class="item-info">
      <div class="backed-svg" :class="{'raised': raised}"><UnknownIcon /></div>
      <span>Unknown report type</span>
    </div>
    <Badge :type="`Reported for ${report.report_type}`" color="orange" class="report-type"/>
    <div v-if="showMessage" class="markdown-body" v-html="renderHighlightedString(report.body)" />
    <ThreadSummary v-if="showThread" :thread="thread" class="thread-summary" :raised="raised"/>
    <div class="reporter-info">
      Reported by
      <nuxt-link :to="`/user/${report.reporter.username}`" class="iconified-link">
        <Avatar :src="report.reporter.avatar_url" circle size="xxs" no-shadow :raised="raised"/>
        <span>{{ report.reporter.username }}</span>
      </nuxt-link>
      <span v-tooltip="$dayjs(report.created).format('MMMM D, YYYY [at] h:mm A')">{{ fromNow(report.created) }}</span>
    </div>
  </div>
</template>

<script setup>
import { renderHighlightedString } from '~/helpers/highlight'
import Avatar from "~/components/ui/Avatar.vue";
import Badge from "~/components/ui/Badge.vue";
import UnknownIcon from '~/assets/images/utils/unknown.svg'
import VersionIcon from '~/assets/images/utils/version.svg'
import ThreadSummary from "~/components/ui/thread/ThreadSummary.vue";

const props = defineProps({
  report: {
    type: Object,
    required: true
  },
  raised: {
    type: Boolean,
    default: false,
  },
  showThread: {
    type: Boolean,
    default: true,
  },
  showMessage: {
    type: Boolean,
    default: true,
  }
})

const thread = computed(() => {
  const t = {
    id: 'qC2Sd2k5',
    type: 'report',
    messages: [
      {
        id: 'u2Vn6tXa',
        author_id: '5XoMa0C4',
        body: {
          type: 'text',
          body: "I don't like this project"
        },
        created: '2023-04-02T21:01:13.320Z'
      },
      {
        id: 'u2Vn6tXa',
        author_id: 'zOuSm8q9',
        body: {
          type: 'text',
          body: 'reasonable'
        },
        created: '2023-04-02T21:01:13.320Z'
      },
      {
        id: 'u2Vn6tXa',
        body: {
          type: 'text',
          body: 'I am anonymous'
        },
        created: '2023-04-02T21:01:13.320Z'
      },
      {
        id: 'lcTs62M0',
        author_id: 'zOuSm8q9',
        body: {
          type: 'deleted'
        },
        created: '2023-04-02T21:01:13.320Z'
      },
      {
        id: 'lcTs62M0',
        author_id: 'zOuSm8q9',
        body: {
          type: 'thread_closure'
        },
        created: '2023-04-02T21:01:13.320Z'
      }
    ],
    members: [
      {
        "id": "eKKLuHEP",
        "github_id": 42325132,
        "username": "Devin",
        "name": "UltraStorm",
        "email": null,
        "avatar_url": "https://staging-cdn.modrinth.com/user/eKKLuHEP/bca3080566f07ebd871026b3309691ff5f5265ff.png",
        "bio": "When I get bored I make stuff",
        "created": "2023-01-02T22:21:23.808760Z",
        "role": "developer",
        "badges": 0,
        "payout_data": null,
        "has_flame_anvil_key": null
      }
    ]
  }

  t.members.push(props.report.reporter)
  t.messages.unshift({
    id: 'initial-report-message',
    author_id: props.report.reporter.id,
    body: {
      type: 'text',
      body: props.report.body
    },
    created: props.report.created
  })
  return t
})
</script>

<style lang="scss" scoped>
.report {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-card-sm);
  flex-wrap: wrap;

  .item-info,
  .reporter-info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .report-type {
    grid-area: type;
  }

  .item-info {
    gap: var(--spacing-card-sm);
    color: var(--color-heading);
    grid-area: title;

    .iconified-stacked-link, .iconified-link {
      gap: var(--spacing-card-sm);
      margin-right: var(--spacing-card-xs);
    }
  }

  .markdown-body {
    grid-area: body;
  }

  .reporter-info {
    grid-area: reporter;
    gap: var(--spacing-card-xs);
    color: var(--color-text-secondary);

    a {
      gap: var(--spacing-card-xs);
    }
  }

  .action {
    grid-area: action;
  }

  .thread-summary {
    grid-area: summary;
  }

  &:not(:last-child) {
    margin-bottom: var(--spacing-card-md);
  }
}
</style>
