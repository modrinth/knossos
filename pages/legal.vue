<template>
  <div class="settings-page">
    <div class="settings-page__sidebar">
      <h1>Legal</h1>

      <div class="vertical-navbar">
        <NuxtLink to="/legal/terms"> <HeartHandshakeIcon /> Terms of Use </NuxtLink>
        <NuxtLink to="/legal/rules"> <ScaleIcon /> Content Rules </NuxtLink>
        <NuxtLink to="/legal/copyright"> <CopyrightIcon /> Copyright Policy</NuxtLink>
        <NuxtLink to="/legal/security"> <ShieldIcon /> Security Notice </NuxtLink>

        <h3>Privacy</h3>
        <NuxtLink to="/legal/privacy"> <LockIcon /> Privacy Policy </NuxtLink>
        <NuxtLink to="/legal/ccpa"> <InfoIcon /> California Privacy Notice </NuxtLink>

        <h3>Rewards Program</h3>
        <NuxtLink to="/legal/cmp"> <CurrencyIcon /> Rewards Program Terms </NuxtLink>
        <NuxtLink to="/legal/cmp-info"> <InfoIcon /> Rewards Program Info </NuxtLink>
      </div>
    </div>
    <div class="settings-page__content">
      <NuxtPage class="card" :route="route" />
    </div>
  </div>
</template>

<script setup>
import {
  InfoIcon,
  HeartHandshakeIcon,
  LockIcon,
  ScaleIcon,
  ShieldIcon,
  CurrencyIcon,
  CopyrightIcon,
} from 'omorphia'

const route = useRoute()
</script>

<style lang="scss" scoped>
.normal-page__content :deep(a) {
  color: var(--color-blue);
  text-decoration: underline;

  &:focus-visible,
  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    filter: brightness(1.2);
  }
}

@media (min-width: 1024px) {
  .normal-page {
    column-gap: var(--gap-lg);

    grid-template:
      'header header' auto
      'sidebar content' auto
      'info content' auto
      'dummy content' 1fr
      / 20rem 1fr;
  }
}
</style>
