<template>
  <div>
    <div class="connected-items">
      <div class="profile-pics">
        <img class="profile-pic" :src="app.icon_url" alt="User profile picture" />
        <div class="connection-indicator">+</div>
        <img class="profile-pic" :src="auth.user.avatar_url" alt="User profile picture" />
      </div>
    </div>
    <div class="title">
      <h2 class="text-center">Authorize {{ app.name }}</h2>
    </div>
    <div class="auth-info">
      <p>
        <strong>{{ app.name }}</strong> by
        <nuxt-link class="text-link" :to="'/user/' + createdBy.id">{{
          createdBy.username
        }}</nuxt-link>
        will be able to:
      </p>
      <ul>
        <li v-for="scope in scopeDefinitions" :key="scope">
          {{ scope }}
        </li>
      </ul>
    </div>
    <div class="button-row">
      <Button class="wide-button" large :action="onReject"> Decline </Button>
      <Button class="wide-button" color="primary" large :action="onAuthorize"> Authorize </Button>
    </div>
    <div class="redirection-notice">
      <p class="redirect-instructions">
        Authorizing will redirect you to
        <span class="redirect-url">{{ redirectUri }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { Button } from 'omorphia'
import { useBaseFetch } from '@/composables/fetch.js'
import { useAuth } from '@/composables/auth.js'
import { getScopeDefinitions } from '@/utils/auth/scopes.ts'

const router = useRoute()
const auth = await useAuth()

const clientId = router.query?.client_id || false
const redirectUri = router.query?.redirect_uri || false
const state = router.query?.state || false

const app = await useBaseFetch('oauth/app/' + clientId, {
  method: 'GET',
  apiVersion: 3,
})

const scopeDefinitions = getScopeDefinitions(BigInt(app.max_scopes))

const createdBy = await useBaseFetch('user/' + app.created_by, {
  method: 'GET',
})

const onAuthorize = async () => {
  const authorization = await useBaseFetch('auth/oauth/authorize', {
    method: 'GET',
    apiVersion: 3,
    query: {
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state || undefined,
    },
  }) // This will contain the flow_id and oauth_client_id for accepting the oauth on behalf of the user

  if (typeof authorization === 'string') {
    window.location.href = authorization
    return
  }

  if (!authorization.flowId) {
    throw new Error('No flow id found in response')
  }

  const res = await useBaseFetch('auth/oauth/accept', {
    method: 'POST',
    apiVersion: 3,
    body: {
      flow: authorization.flowId,
    },
  })

  if (typeof res === 'string') {
    window.location.href = res
    return
  }

  throw new Error('No redirect location found in response')
}

const onReject = async () => {
  const authorization = await useBaseFetch('auth/oauth/authorize', {
    method: 'GET',
    apiVersion: 3,
    query: {
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state || undefined,
    },
  }) // This will contain the flow_id and oauth_client_id for accepting the oauth on behalf of the user

  if (typeof authorization === 'string') {
    window.location.href = authorization
    return
  }

  if (!authorization.flowId) {
    throw new Error('No flow id found in response')
  }

  const res = await useBaseFetch('auth/oauth/reject', {
    method: 'POST',
    apiVersion: 3,
    body: {
      flow: authorization.flowId,
    },
  })

  if (typeof res === 'string') {
    window.location.href = res
    return
  }

  throw new Error('No redirect location found in response')
}

definePageMeta({
  middleware: 'auth',
})
</script>

<style scoped lang="scss">
.title {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
  justify-content: center;
  align-items: center;

  h2 {
    margin-bottom: 0 !important;
  }
}
.redirection-notice {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
  margin-top: var(--gap-md);
  text-align: center;

  .redirect-instructions {
    font-size: var(--font-size-sm);
  }

  .redirect-url {
    font-weight: bold;
  }
}

.wide-button {
  width: 100% !important;
}

.button-row {
  display: flex;
  flex-direction: row;
  gap: var(--gap-xs);
  justify-content: center;
}
.text-center {
  text-align: center;
}

.auth-info {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
}

.profile-pics {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;

  .connection-indicator {
    // Make sure the text sits in the middle and is centered.
    // Make the text large, and make sure it's not selectable.
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    user-select: none;

    color: var(--color-primary);
  }
}

.profile-pic {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  margin: 0 1rem;
}

.dotted-border-line {
  width: 75%;
  border: 0.1rem dashed var(--color-divider);
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
