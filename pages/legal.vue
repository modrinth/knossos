<template>
  <div class="narrow-page">
    <h1 class="page-title">Modrinth legal files</h1>
    <div class="card styled-tabs">
      <NuxtLink class="tab" to="/legal/terms">
        <span>Terms and Conditions</span>
      </NuxtLink>
      <NuxtLink class="tab" to="/legal/privacy">
        <span>Privacy Policy</span>
      </NuxtLink>
      <NuxtLink class="tab" to="/legal/rules">
        <span>Project Rules</span>
      </NuxtLink>
    </div>
    <NuxtChild />
  </div>
</template>
