<template>
  <div>
    <template v-if="flow">
      <label for="two-factor-code">
        <span class="label__title">{{ formatMessage(messages.twoFactorCodeLabel) }}</span>
        <span class="label__description">
          {{ formatMessage(messages.twoFactorCodeLabelDescription) }}
        </span>
      </label>
      <input
        id="two-factor-code"
        v-model="twoFactorCode"
        maxlength="11"
        type="text"
        :placeholder="formatMessage(messages.twoFactorCodeInputPlaceholder)"
        @keyup.enter="begin2FASignIn"
      />

      <button class="btn btn-primary continue-btn" @click="begin2FASignIn">
        Sign in <RightArrowIcon />
      </button>
    </template>
    <template v-else>
      <h1>{{ formatMessage(messages.thirdPartySectionTitle) }}</h1>

      <section class="third-party">
        <a class="btn" :href="getAuthUrl('discord')">
          <DiscordIcon />
          <span>Discord</span>
        </a>
        <a class="btn" :href="getAuthUrl('github')">
          <GitHubIcon />
          <span>GitHub</span>
        </a>
        <a class="btn" :href="getAuthUrl('microsoft')">
          <MicrosoftIcon />
          <span>Microsoft</span>
        </a>
        <a class="btn" :href="getAuthUrl('google')">
          <GoogleIcon />
          <span>Google</span>
        </a>
        <a class="btn" :href="getAuthUrl('steam')">
          <SteamIcon />
          <span>Steam</span>
        </a>
        <a class="btn" :href="getAuthUrl('gitlab')">
          <GitLabIcon />
          <span>GitLab</span>
        </a>
      </section>

      <h1>{{ formatMessage(messages.authFormSectionTitle) }}</h1>

      <section class="auth-form">
        <div class="iconified-input">
          <label for="email" hidden>{{ formatMessage(messages.emailUsernameLabel) }}</label>
          <MailIcon />
          <input
            id="email"
            v-model="email"
            type="text"
            autocomplete="username"
            class="auth-form__input"
            :placeholder="formatMessage(messages.emailUsernameLabel)"
          />
        </div>

        <div class="iconified-input">
          <label for="password" hidden>{{ formatMessage(messages.passwordLabel) }}</label>
          <KeyIcon />
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="auth-form__input"
            :placeholder="formatMessage(messages.passwordLabel)"
          />
        </div>

        <NuxtTurnstile ref="turnstile" v-model="token" class="turnstile" />

        <button class="btn btn-primary continue-btn centered-btn" @click="beginPasswordSignIn()">
          Sign in <RightArrowIcon />
        </button>

        <div class="auth-form__additional-options">
          <NuxtLink class="text-link" to="/auth/reset-password">
            {{ formatMessage(messages.forgotPasswordLink) }}
          </NuxtLink>
          <p>•</p>
          <NuxtLink class="text-link" :to="signUpLink">
            {{ formatMessage(messages.createAccountLink) }}
          </NuxtLink>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { RightArrowIcon } from 'omorphia'
import GitHubIcon from 'assets/icons/auth/sso-github.svg'
import MicrosoftIcon from 'assets/icons/auth/sso-microsoft.svg'
import GoogleIcon from 'assets/icons/auth/sso-google.svg'
import SteamIcon from 'assets/icons/auth/sso-steam.svg'
import DiscordIcon from 'assets/icons/auth/sso-discord.svg'
import KeyIcon from 'assets/icons/auth/key.svg'
import MailIcon from 'assets/icons/auth/mail.svg'
import GitLabIcon from 'assets/icons/auth/sso-gitlab.svg'

const { formatMessage } = useVIntl()

const messages = defineMessages({
  authFormSectionTitle: {
    id: 'auth.sign-in.section.auth-form.title',
    defaultMessage: 'Or use a password',
  },
  createAccountLink: {
    id: 'auth.sign-in.link.create-account',
    defaultMessage: 'Create an account',
  },
  thirdPartySectionTitle: {
    id: 'auth.sign-in.section.third-party.title',
    defaultMessage: 'Sign in with',
  },
  emailUsernameLabel: {
    id: 'auth.sign-in.label.email-username',
    defaultMessage: 'Email or username',
  },
  forgotPasswordLink: {
    id: 'auth.sign-in.link.forgot-password',
    defaultMessage: 'Forgot password?',
  },
  passwordLabel: {
    id: 'auth.sign-in.label.password',
    defaultMessage: 'Password',
  },
  twoFactorCodeInputPlaceholder: {
    id: 'auth.sign-in.input.two-factor-code.placeholder',
    defaultMessage: 'Enter code...',
  },
  twoFactorCodeLabel: {
    id: 'auth.sign-in.label.two-factor-code',
    defaultMessage: 'Enter two-factor code',
  },
  twoFactorCodeLabelDescription: {
    id: 'auth.sign-in.label.two-factor-code.description',
    defaultMessage: 'Please enter a two-factor code to proceed.',
  },
  signInTitle: {
    id: 'auth.sign-in.title',
    defaultMessage: 'Sign In',
  },
})

useHead({
  title: () => `${formatMessage(messages.signInTitle)} - Modrinth`,
})

const auth = await useAuth()
const route = useRoute()

if (route.fullPath.includes('new_account=true')) {
  await navigateTo(
    `/auth/welcome?authToken=${route.query.code}${
      route.query.redirect ? `&redirect=${encodeURIComponent(route.query.redirect)}` : ''
    }`
  )
} else if (route.query.code) {
  await finishSignIn()
}

if (auth.value.user) {
  await navigateTo('/dashboard')
}

const turnstile = ref()

const email = ref('')
const password = ref('')
const token = ref('')

const flow = ref(route.query.flow)

const signUpLink = computed(
  () => `/auth/sign-up${route.query.redirect ? `?redirect=${route.query.redirect}` : ''}`
)

async function beginPasswordSignIn() {
  startLoading()
  try {
    const res = await useBaseFetch('auth/login', {
      method: 'POST',
      body: {
        username: email.value,
        password: password.value,
        challenge: token.value,
      },
    })

    if (res.flow) {
      flow.value = res.flow
    } else {
      await finishSignIn(res.session)
    }
  } catch (err) {
    addNotification({
      group: 'main',
      title: formatMessage(commonMessages.errorNotificationTitle),
      text: err.data ? err.data.description : err,
      type: 'error',
    })
    turnstile.value?.reset()
  }
  stopLoading()
}

const twoFactorCode = ref(null)
async function begin2FASignIn() {
  startLoading()
  try {
    const res = await useBaseFetch('auth/login/2fa', {
      method: 'POST',
      body: {
        flow: flow.value,
        code: twoFactorCode.value ? twoFactorCode.value.toString() : twoFactorCode.value,
      },
    })

    await finishSignIn(res.session)
  } catch (err) {
    addNotification({
      group: 'main',
      title: formatMessage(commonMessages.errorNotificationTitle),
      text: err.data ? err.data.description : err,
      type: 'error',
    })
    turnstile.value?.reset()
  }
  stopLoading()
}
async function finishSignIn(token) {
  if (token) {
    await useAuth(token)
    await useUser()
  }

  if (route.query.redirect) {
    await navigateTo(route.query.redirect)
  } else {
    await navigateTo('/dashboard')
  }
}
</script>
