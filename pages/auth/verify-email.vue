<template>
  <div>
    <template v-if="auth.user && auth.user.email_verified && !success">
      <h1>{{ formatMessage(messages.alreadyVerifiedTitle) }}</h1>

      <section class="auth-form">
        <p>{{ formatMessage(messages.alreadyVerifiedDescription) }}</p>

        <NuxtLink class="btn" to="/settings/account"> <SettingsIcon /> {{ formatMessage(messages.accountSettingsButton) }} </NuxtLink>
      </section>
    </template>

    <template v-else-if="success">
      <h1>{{ formatMessage(messages.successedVerificationTitle) }}</h1>

      <section class="auth-form">
        <p>{{ formatMessage(messages.successedVerificationDescription) }}</p>

        <NuxtLink v-if="auth.user" class="btn" link="/settings/account">
          <SettingsIcon /> {{ formatMessage(messages.accountSettingsButton) }}
        </NuxtLink>
        <NuxtLink v-else to="/auth/sign-in" class="btn btn-primary continue-btn centered-btn">
          {{ formatMessage(messages.signInButton) }} <RightArrowIcon />
        </NuxtLink>
      </section>
    </template>

    <template v-else>
      <h1>{{ formatMessage(messages.failedVerificationTitle) }}</h1>

      <section class="auth-form">
        <p>
          <template v-if="auth.user">
            {{ formatMessage(messages.failedVerificationAuthDescription) }}
          </template>
          <template v-else>
            {{ formatMessage(messages.failedVerificationDescription) }}
          </template>
        </p>

        <button v-if="auth.user" class="btn btn-primary continue-btn" @click="resendVerifyEmail">
          {{ formatMessage(messages.resendEmailButton) }} <RightArrowIcon />
        </button>

        <NuxtLink v-else to="/auth/sign-in" class="btn btn-primary continue-btn centered-btn">
          {{ formatMessage(messages.signInButton) }} <RightArrowIcon />
        </NuxtLink>
      </section>
    </template>
  </div>
</template>
<script setup>
import { SettingsIcon, RightArrowIcon } from 'omorphia'

const { formatMessage } = useVIntl()

const messages = defineMessages({
  accountSettingsButton: {
    id: 'auth.verify-email.button.account-settings',
    defaultMessage: 'Account settings',
  },
  alreadyVerifiedDescription: {
    id: 'auth.verify-email.description.already-verified',
    defaultMessage: 'Your email is already verified!',
  },
  alreadyVerifiedTitle: {
    id: 'auth.verify-email.title.already-verified',
    defaultMessage: 'Email already verified',
  },
  failedVerificationDescription: {
    id: 'auth.verify-email.description.failed-verification',
    defaultMessage: 'We were unable to verify your email. Try re-sending the verification email through your dashboard by signing in.',
  },
  failedVerificationAuthDescription: {
    id: 'auth.verify-email.description.failed-verification-auth',
    defaultMessage: 'We were unable to verify your email. Try re-sending the verification email through the button below.',
  },
  failedVerificationTitle: {
    id: 'auth.verify-email.title.failed-verification',
    defaultMessage: 'Email verification failed',
  },
  resendEmailButton: {
    id: 'auth.verify-email.button.resend-email',
    defaultMessage: 'Resend verification email',
  },
  signInButton: {
    id: 'auth.verify-email.button.sign-in',
    defaultMessage: 'Sign in',
  },
  successedVerificationDescription: {
    id: 'auth.verify-email.description.successed-verification',
    defaultMessage: 'Your email address has been successfully verified!',
  },
  successedVerificationTitle: {
    id: 'auth.verify-email.title.successed-verification',
    defaultMessage: 'Email verification',
  },
  verifyEmailTitle: {
    id: 'auth.verify-email.title',
    defaultMessage: 'Verify Email',
  },
})

useHead({
  title: () => `${formatMessage(messages.verifyEmailTitle)} - Modrinth`,
})

const auth = await useAuth()

const success = ref(false)
const route = useRoute()

if (route.query.flow) {
  try {
    const emailVerified = useState('emailVerified', () => null)

    if (emailVerified.value === null) {
      await useBaseFetch('auth/email/verify', {
        method: 'POST',
        body: {
          flow: route.query.flow,
        },
      })
      emailVerified.value = true
      success.value = true
    }

    if (emailVerified.value) {
      success.value = true

      if (auth.value.token) {
        await useAuth(auth.value.token)
      }
    }
  } catch (err) {
    success.value = false
  }
}
</script>
