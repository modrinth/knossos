<script setup>
import { SearchIcon, Card, Button, LinkIcon, Promotion } from 'omorphia'
import Avatar from '~/components/ui/Avatar.vue'
import ProjectCard from '~/components/ui/ProjectCard.vue'
import MegaphoneIcon from '~/assets/images/utils/megaphone.svg'
</script>

<template>
  <div class="organization">
    <Card class="banner">
      <span class="color" />
      <div class="avatar-row">
        <Avatar class="icon" size="lg" />
        <div class="info">
          <h1 class="name">Organization Name</h1>
          <div class="description markdown-body">
            <p>Organization Description</p>
          </div>
        </div>
        <div class="input-group push-right">
          <Button> Follow </Button>
          <Button> Share </Button>
          <Button> Report </Button>
        </div>
      </div>
      <div class="links">
        <a v-for="ignored in 10" class="link">
          <LinkIcon />
          Link {{ ignored }}
        </a>
      </div>
    </Card>
    <Promotion class="promotion" />
    <div class="sidebar">
      <Card class="community-post-list">
        <h2>Community posts</h2>
        <div v-for="ignored in 5" :key="ignored" class="community-post">
          <div class="iconified-field">
            <MegaphoneIcon />
            <p>Announcement title</p>
          </div>
          <div class="author iconified-field">
            <Avatar />
            <p>Author</p>
          </div>
        </div>
      </Card>
      <Card class="creator-list">
        <h2>Creators</h2>
        <div v-for="ignored in 5" :key="ignored" class="creator">
          <Avatar />
          <p class="name">Creator {{ ignored }}</p>
          <p class="role">Random title</p>
        </div>
      </Card>
    </div>
    <div class="content">
      <div class="pinned-projects display-mode--gallery">
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </div>
      <div class="all-projects">
        <Card class="search-card">
          <div class="iconified-input">
            <SearchIcon />
            <input type="text" placeholder="Search projects" />
          </div>
        </Card>
        <div class="display-mode--list projects">
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.organization {
  max-width: 1080px;
  margin: 0 auto;
  display: grid;
  grid-template:
    'banner banner' auto
    'promotion promotion' auto
    'content sidebar' auto
    / auto 20rem;
  gap: var(--gap-md);
}

.sidebar {
  grid-area: sidebar;
}

.content {
  grid-area: content;
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
}

.banner {
  grid-area: banner;
  display: flex;
  flex-direction: column;
  padding: var(--gap-xl);
  gap: var(--gap-md);
  overflow: hidden;
  margin-bottom: 0;

  .color {
    height: 10rem;
    background-color: var(--color-brand);
    margin: -1.5rem -1.5rem 0 -1.5rem;
  }

  h1 {
    margin: 0 0 var(--gap-sm) 0;
  }

  .icon {
    margin-top: -4rem;
  }

  .info {
    display: flex;
    flex-direction: column;
  }

  .links {
    display: flex;
    flex-direction: row;

    a {
      margin: 0 0.5rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--gap-xs);
      text-decoration: underline;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .avatar-row {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: var(--gap-md);

    .input-group {
      flex-grow: 1;
    }
  }
}

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

.pinned-projects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: var(--gap-md);
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

.promotion {
  margin-bottom: 0;
  grid-area: promotion;
}

.creator-list {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
  padding: var(--gap-xl);

  h2 {
    margin: 0;
  }

  .creator {
    display: grid;
    gap: var(--gap-xs);
    grid-template:
      'avatar name' auto
      'avatar role' auto
      / auto 1fr;

    p {
      margin: 0;
    }

    .name {
      grid-area: name;
      align-self: flex-end;
      margin-left: var(--gap-xs);
      font-weight: bold;
    }

    .role {
      grid-area: role;
      align-self: flex-start;
      margin-left: var(--gap-xs);
    }

    .avatar {
      grid-area: avatar;
    }
  }
}
</style>
