<script setup>
import {Avatar, Button, Card, HeartIcon, HamburgerIcon, GlobeIcon} from "omorphia";
import DiscordIcon from "~/assets/images/external/discord.svg";
import YoutubeIcon from "~/assets/images/utils/youtube.svg";

defineProps({
  organization: {
    type: Object,
    default() {
      return {}
    },
  },
  projects: {
    type: Array,
    default() {
      return []
    },
  },
})
</script>

<template>
  <div class="members">
    <Card v-for="member in organization.members" class="member-card">
      <div class="member-buttons">
        <Button class="transparent" icon-only>
          <HeartIcon/>
        </Button>
        <Button class="transparent" icon-only>
          <HamburgerIcon/>
        </Button>
      </div>
      <Avatar class="member-icon" :src="member.user.avatar_url" circle/>
      <div class="member-text">
        <div class="title"> {{member.user.username}} </div>
        <div class="markdown-body">
          <p> {{member.role}} </p>
        </div>
      </div>
      <div class="member-links">
        <Button class="round" icon-only>
          <GlobeIcon/>
        </Button>
        <Button class="round" icon-only>
          <YoutubeIcon/>
        </Button>
        <Button class="round" icon-only>
          <DiscordIcon/>
        </Button>
      </div>
    </Card>
  </div>
</template>

<style scoped lang="scss">
.member-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--gap-md);
  width: 100%;

  .member-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;

    .btn {
      color: var(--color-base);
    }
  }

  .member-icon {
    --size: 4rem;
  }

  .member-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: var(--gap-md) 0 0 0;

    .title {
      margin: 0;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-md);
    }

    .markdown-body {
      font-size: var(--font-size-sm);
      color: var(--color-gray);
    }
  }

  .member-links {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    margin: var(--gap-md) 0 0 0;
    gap: var(--gap-sm);

    .btn {
      color: var(--color-base);
    }
  }
}

.members {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  column-gap: var(--gap-md);
  margin-right: auto;
}

.round {
  border-radius: 50%;
}
</style>
