<template>
  <div>
    <div class="connected-items">
      <div class="dotted-border-line" />
      <div class="profile-pics">
        <img class="profile-pic" :src="userProfilePicUrl" alt="User profile picture" />
        <img class="profile-pic" :src="auth.user.avatar_url" alt="User profile picture" />
      </div>
    </div>
    <div>
      <pre><code>{{ JSON.stringify(oauth, null, 2) }}</code></pre>
      <pre><code>{{ JSON.stringify(clientInformation, null, 2) }}</code></pre>
    </div>
  </div>
</template>

<script setup>
import { useBaseFetch } from '@/composables/fetch.js'
import { useAuth } from '@/composables/auth.js'

const router = useRoute()
const auth = await useAuth()

const clientId = router.query?.client_id || false
const redirectUri = router.query?.redirect_uri || false
const scope = router.query?.scope || false
const state = router.query?.state || false

const oauth = {
  clientId,
  redirectUri,
  scope,
  state,
}

const clientInformation = await useBaseFetch('oauth/app/' + clientId, { apiVersion: 3 })

definePageMeta({
  middleware: 'auth',
})
</script>

<style lang="scss">
.profile-pics {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.profile-pic {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  margin: 0 1rem;
}

.dotted-border-line {
  width: 75%;
  border: 0.1rem dashed #000;
}

.connected-items {
  // Display dotted-border-line under profile-pics and centered behind them
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  margin-top: 1rem;

  // Display profile-pics on top of dotted-border-line
  .profile-pics {
    position: relative;
    z-index: 2;
  }

  // Display dotted-border-line behind profile-pics
  .dotted-border-line {
    position: absolute;
    z-index: 1;
  }
}
</style>
