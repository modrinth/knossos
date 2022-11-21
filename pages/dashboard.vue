<template>
  <div class="normal-page">
    <div class="normal-page__sidebar">
      <aside class="universal-card">
        <h1>Dashboard<span class="beta-badge">BETA</span></h1>
        <NavStack>
          <NavStackItem link="/dashboard" label="Overview">
            <IconDashboard />
          </NavStackItem>
          <!--          <NavStackItem link="/dashboard/projects" label="Projects">-->
          <!--            <IconList />-->
          <!--          </NavStackItem>-->
          <!--          <NavStackItem link="/dashboard/analytics" label="Analytics">-->
          <!--            <IconChart />-->
          <!--          </NavStackItem>-->
          <NavStackItem link="/dashboard/revenue" label="Revenue">
            <IconCurrency />
          </NavStackItem>
        </NavStack>
      </aside>
    </div>
    <div class="normal-page__content">
      <NuxtChild />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
}
</script>

<style lang="scss" scoped></style>
