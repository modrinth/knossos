<template>
  <div class="page-container">
    <div class="page-contents">
      <div class="sidebar-l">
        <div class="card info">
          <img :src="user.avatar_url" :alt="user.username" />
          <div class="text">
            <h2>{{ user.username }}</h2>
            <p v-if="user.bio" class="bio">{{ user.bio }}</p>
            <p v-if="user.role === 'admin'" class="badge red">Admin</p>
            <p v-if="user.role === 'moderator'" class="badge yellow">
              Moderator
            </p>
            <p v-if="user.role === 'developer'" class="badge green">
              Developer
            </p>
          </div>
        </div>
        <div class="card stats">
          <p class="joined-text">Joined {{ $dayjs(user.created).fromNow() }}</p>
        </div>
      </div>
      <div class="content">
        <client-only>
          <EthicalAd />
        </client-only>
        <div class="mods">
          <SearchResult
            v-for="result in mods"
            :id="result.mod_id"
            :key="result.mod_id"
            :name="result.title"
            :description="result.description"
            :latest-version="result.latest_version"
            :created-at="result.published"
            :updated-at="result.updated"
            :downloads="result.downloads.toString()"
            :icon-url="result.icon_url"
            :author-url="result.author_url"
            :page-url="result.page_url"
            :categories="result.categories"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import SearchResult from '@/components/ProjectCard'
import EthicalAd from '@/components/EthicalAd'

export default {
  auth: false,
  components: {
    EthicalAd,
    SearchResult,
  },
  async asyncData(data) {
    let res = await axios.get(
      `https://api.modrinth.com/api/v1/user/${data.params.id}`
    )
    const user = res.data

    let mods = []
    res = await axios.get(
      `https://api.modrinth.com/api/v1/user/${data.params.id}/mods`
    )
    if (res.data) {
      res = await axios.get(
        `https://api.modrinth.com/api/v1/mods?ids=${JSON.stringify(res.data)}`
      )
      mods = res.data
    }

    return {
      mods,
      user,
    }
  },
}
</script>

<style lang="scss" scoped>
.sidebar-l {
  .info {
    @extend %row;
    img {
      width: 6rem;
      height: 6rem;
      margin-right: var(--spacing-card-md);
      border-radius: var(--size-rounded-icon);
    }
    .text {
      h2 {
        margin: 0;
        color: var(--color-text-dark);
        font-size: var(--font-size-lg);
      }
      .badge {
        display: inline-block;
      }
    }
  }
  .stats {
  }
}

.mods {
}
</style>
