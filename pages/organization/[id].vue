<script setup>
import {
  SearchIcon,
  Card,
  Button,
  LinkIcon,
  Promotion,
  ShareIcon,
  HeartIcon,
  CurrencyIcon,
  ReportIcon,
  SunriseIcon,
  GitHubIcon,
  DownloadIcon,
  SettingsIcon,
} from 'omorphia'
import Avatar from '~/components/ui/Avatar.vue'
import YoutubeIcon from 'assets/images/utils/youtube.svg'
import DiscordIcon from 'assets/images/external/discord.svg'
import NavRow from '~/components/ui/NavRow.vue'
</script>

<template>
  <div class="normal-page no-sidebar organization">
    <div class="normal-page__header">
      <div class="page-header">
        <Avatar
          class="page-header__icon"
          src="https://cdn.modrinth.com/user/6ZoP9xY8/845ab3625ed09a90b58b4ec6089c92d8e459ca09.png"
          size="md"
          circle
        />
        <div class="page-header__text">
          <div class="title">
            <h1>Terrarium</h1>
            <Button icon-only> <ShareIcon /> </Button>
          </div>
          <div class="links">
            <div class="link-like">
              <DownloadIcon />
              <span>1.2M Downloads</span>
            </div>
            <div class="link-like">
              <HeartIcon />
              <span>1.9k Followers</span>
            </div>
          </div>
          <div class="links">
            <a href="https://docs.terrarium.earth">
              <LinkIcon />
              <span>Website</span>
            </a>
            <a href="https://github.com">
              <GitHubIcon />
              <span>Github</span>
            </a>
            <a href="https://youtube.com">
              <YoutubeIcon />
              <span>Youtube</span>
            </a>
            <a href="https://discord.gg">
              <DiscordIcon />
              <span>Discord</span>
            </a>
          </div>
        </div>
        <div class="page-header__buttons">
          <div class="group">
            <Button>
              <HeartIcon />
              Follow
            </Button>
            <Button>
              <ReportIcon />
              Report
            </Button>
          </div>
          <div class="group">
            <Button>
              <HeartIcon />
              Subscribe
            </Button>
            <Button>
              <CurrencyIcon />
              Donate
            </Button>
          </div>
        </div>
      </div>
      <Promotion />
      <Card class="nav">
        <NavRow
          :links="[
            {
              label: 'Overview',
              href: '/organization/1',
            },
            {
              label: 'Projects',
              href: '/organization/1/projects',
            },
            {
              label: 'Collections',
              href: '/organization/1/collections',
            },
            {
              label: 'Members',
              href: '/organization/1/members',
            },
          ]"
        />
        <Button>
          <SettingsIcon />
          Settings
        </Button>
      </Card>
    </div>
    <div class="normal-page__content">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped lang="scss">
.iconified-field {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--gap-xs);

  p {
    margin: 0;
  }

  :deep(.avatar) {
    --size: 1.5rem;
  }
}

.community-post-list {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
  padding: var(--gap-xl);

  h2 {
    margin: 0;
  }

  .community-post {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    .author {
      margin-left: 1rem;
    }
  }
}

.all-projects {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);

  .search-card {
    margin-bottom: 0;
    padding: var(--gap-lg);
  }

  .projects {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
  }
}

.socials {
  display: flex;
  flex-direction: column;
  padding: var(--gap-xl);
  gap: var(--gap-sm);

  .social {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--gap-xl);

    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--gap-sm);
      opacity: 0.65;

      svg {
        width: 1.25rem;
        height: 1.25rem;
      }
    }

    a,
    .stat {
      text-align: right;
      width: 100%;
      overflow: hidden;
      text-overflow: fade(10%);
    }

    .stat {
      font-weight: bold;
    }
  }

  hr {
    margin: var(--gap-sm) 0;
  }
}

.nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: var(--gap-md);
}
</style>
