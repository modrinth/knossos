<template>
  <div class="narrow-page">
    <h1 class="page-title">Modrinth legal files</h1>
    <div class="card styled-tabs">
      <NuxtLink class="styled-tabs__tab" to="/legal/terms">
        <span>Terms and Conditions</span>
      </NuxtLink>
      <NuxtLink class="styled-tabs__tab" to="/legal/privacy">
        <span>Privacy Policy</span>
      </NuxtLink>
      <NuxtLink class="styled-tabs__tab" to="/legal/rules">
        <span>Project Rules</span>
      </NuxtLink>
    </div>
    <NuxtChild />
  </div>
</template>
