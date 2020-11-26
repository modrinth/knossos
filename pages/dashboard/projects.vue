<template>
  <div class="page-container">
    <div class="page-contents">
      <div class="sidebar-l">
        <div class="card page-nav">
          <nuxt-link :to="'/dashboard/projects'" class="tab last">
            <ModIcon />
            My mods
          </nuxt-link>
        </div>
        <client-only>
          <EthicalAd type="image" />
        </client-only>
      </div>
      <div class="content">
        <div class="section-header columns">
          <h3 class="column-grow-1">My mods</h3>
          <nuxt-link class="create-button column" to="/mod/create">
            Create a mod
          </nuxt-link>
        </div>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Downloads</th>
              <th>Last updated</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mod in mods" :key="mod.id">
              <td>
                <nuxt-link :to="'/mod/' + mod.id">
                  <img class="rounded-md" :src="mod.icon_url" />
                </nuxt-link>
              </td>
              <td class="mod-name">
                <nuxt-link :to="'/mod/' + mod.id">
                  {{ mod.title }}
                </nuxt-link>
              </td>
              <td>Owner</td>
              <td>
                <span v-if="mod.status === 'approved'" class="badge green">
                  Approved
                </span>
                <span v-if="mod.status === 'rejected'" class="badge red">
                  Rejected
                </span>
                <span v-if="mod.status === 'draft'" class="badge yellow">
                  Draft
                </span>
                <span v-if="mod.status === 'processing'" class="badge yellow">
                  Processing
                </span>
                <span v-if="mod.status === 'unlisted'" class="badge gray">
                  Unlisted
                </span>
                <span v-if="mod.status === 'unknown'" class="badge gray">
                  Unknown
                </span>
              </td>
              <td>{{ mod.downloads }}</td>
              <td>{{ $dayjs(mod.published).format('YYYY-MM-DD') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import EthicalAd from '@/components/EthicalAd'

import ModIcon from '~/assets/images/sidebar/mod.svg?inline'

export default {
  components: {
    EthicalAd,
    ModIcon,
  },
  async fetch() {
    try {
      let res = await axios.get(
        `https://api.modrinth.com/api/v1/user/${this.$auth.user.id}/mods`
      )

      if (res.data) {
        res = await axios.get(
          `https://api.modrinth.com/api/v1/mods?ids=${JSON.stringify(res.data)}`
        )
        this.mods = res.data
      }
    } catch (err) {}
  },
  data() {
    return {
      mods: [],
    }
  },
}
</script>

<style lang="scss" scoped>
.section-header {
  @extend %card;
  padding: var(--spacing-card-md) var(--spacing-card-lg);
  margin-bottom: var(--spacing-card-md);
  h3 {
    margin: auto 0;
    color: var(--color-text-dark);
    font-weight: var(--font-weight-extrabold);
  }
}

.create-button {
  margin: auto 0;
  padding: 6px 20px;
  border-radius: var(--size-rounded-control);
  color: var(--color-brand-inverted);
  background-color: var(--color-brand);
}

table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin-bottom: var(--spacing-card-md);
  background: var(--color-raised-bg);
  border-radius: var(--size-rounded-card);

  * {
    text-align: left;
  }

  tr:not(:last-child),
  tr:first-child {
    th,
    td {
      border-bottom: 1px solid var(--color-divider);
    }
  }

  th,
  td {
    &:first-child {
      text-align: center;
      width: 7%;
    }

    &:nth-child(2) {
      padding-left: 0;
      width: 30%;
    }
  }

  th {
    color: var(--color-heading);
    font-size: 0.8rem;
    letter-spacing: 0.02rem;
    margin-bottom: 0.5rem;
    margin-top: 1.5rem;
    padding: 1rem 1rem;
    text-transform: uppercase;
  }

  td {
    padding: 0.75rem;

    img {
      height: 3rem;
      width: 3rem;
    }
  }
}

@media screen and (max-width: 550px) {
  th,
  td {
    &:nth-child(1) {
      img {
        height: 2rem;
        width: 2rem;
      }
    }
    &:nth-child(3) {
      display: none;
    }
  }
}

@media screen and (max-width: 850px) {
  th,
  td {
    &:nth-child(2) {
      width: 25% !important;
    }
    &:nth-child(6) {
      display: none;
    }
  }
}

.mod-name {
  font-weight: bold;
}
</style>
