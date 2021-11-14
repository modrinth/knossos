<template>
  <div class="main">
    <div class="card">
      <h1>Roadmap</h1>
      <p>
        This is a listing of completed, planned, and in progress features for
        Modrinth. An up-to-date roadmap can also be found in our
        <a href="https://discord.gg/EUHuJHt">Discord server</a>!
      </p>
      <h2>Completed</h2>
      <ul>
        <li>Create an alternative mod hosting platform</li>
        <li>Implement fast and accurate search</li>
        <li>Be transparent and public</li>
        <li>Create an open and robust API</li>
        <li>Comply with the GDPR and protect your privacy</li>
        <li>Provide quality-of-life features like notifications, and more</li>
        <li>Allow creators to team up and manage permissions</li>
      </ul>
      <h2>In Progress</h2>
      <ul>
        <li>Implement modpacks and support for project types</li>
        <li>A gallery system for projects to show off screenshots</li>
        <li>An overhauled frontend</li>
        <li>A way for projects to specify dependencies</li>
        <li>Squash bugs and fix problems</li>
        <li>Fully document our API</li>
      </ul>
      <h2>Planned</h2>
      <ul>
        <li>Pay creators a share of ads money</li>
        <li>Automate platform migration process</li>
        <li>Roll out our own authentication service</li>
        <li>Provide analytics and stats to creators</li>
        <li>And even more cool features that we haven't thought of yet!</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  auth: false,
}
</script>
<style lang="scss" scoped>
.main {
  margin: var(--spacing-card-sm) auto;
  max-width: 800px;
}

a {
  text-decoration: underline;
  color: var(--color-link);
}
</style>
