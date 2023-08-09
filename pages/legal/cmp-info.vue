<template>
  <div class="markdown-body">
    <h1>Rewards Program Information</h1>
    <p><em>Last edited: August 9, 2023</em></p>
    <p>
      This page was created for transparency for how the rewards program works on Modrinth. Feel
      free to join our Discord or email support@modrinth.com if you have any questions!
    </p>
    <p>
      This document is provided for informational purposes only and does not constitute a legal
      agreement. Modrinth makes no representations or warranties as to the accuracy, completeness,
      or reliability of the information contained herein.
    </p>
    <h2>Rewards Distribution</h2>
    <p>
      We collect ad revenue on our website and app through our ad network
      <a href="https://adrinth.com">Adrinth</a>. We then distribute this ad revenue to creators.
    </p>
    <p>
      The advertising revenue of the entire website and app is split 90% to creators and 10% to
      Modrinth.
    </p>
    <p>
      The creator allotment to the pool is decided by how many page views and in-app downloads your
      project receives (user profiles are not used in this calculation). Each page view and in-app
      download counts as a "point". Then, the money is distributed based on each author's point
      earnings daily.
    </p>
    <p>For example, consider this test scenario (all numbers are fake):</p>
    <ul>
      <li>The site earns 100$ on a day.</li>
      <li>User A has the projects: NoobCraft and Minesweeper</li>
      <li>NoobCraft receives 10 page views and 30 in-app downloads (40 points)</li>
      <li>Minesweeper receives 100 page views and 10 in-app downloads (110 points)</li>
      <li>
        User B and C both co-own these projects: Bloxcraft and Craftnite. They split their payouts
        40/60.
      </li>
      <li>Bloxcraft receives 50 page views and 20 in-app downloads (70 points)</li>
      <li>Craftnite receives 10 page views and 0 in-app downloads (10 points)</li>
    </ul>
    <p>In this scenario, the earnings for each creator and Modrinth would be as follows:</p>
    <ul>
      <li>Modrinth: $10 (10% of 100$, the site's earnings for the day)</li>
      <li>User A: $58.69 ($90 * (10 + 30 + 100 + 10)/230)</li>
      <li>User B: $12.52 (0.4 * $90 * (50 + 20 + 10 + 0)/230)</li>
      <li>User C: $18.78 (0.6 * $90 * (50 + 20 + 10 + 0)/230)</li>
    </ul>
    <p>
      Page views are counted when a legitimate browser views a project page. In-app downloads when a
      user logged into the launcher downloads a project. Project downloads alongside modpack
      downloads are counted equally. In each category, Modrinth actively removes botted downloads
      and page views at our own discretion. If users are caught botting, they will be permanently
      banned from using Modrinth's services.
    </p>
    <p>
      Currently, there is no way to view page views or in-app downloads information for your
      projects. We are currently working on an analytics dashboard which will display this
      information.
    </p>
  </div>
</template>

<script>
export default {
  name: 'CmpInfo',
}
</script>

<style scoped></style>
